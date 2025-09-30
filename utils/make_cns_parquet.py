#!/usr/bin/env python3
"""Convert a large JSON (array or NDJSON) file to Apache Parquet in streaming batches.

Usage:
  python scripts/json_to_parquet.py \
    --input data/newsbank/articles/star_democrat_articles_master.json \
    --output data/newsbank/articles/star_democrat_articles_master.parquet \
    --batch-size 10000

The script uses a streaming reader to avoid loading the entire file into memory.
It requires `pandas` and `pyarrow`. For JSON arrays it uses `ijson` for streaming.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Iterator, Dict, Any, Optional

try:
    import ijson
except Exception:
    ijson = None

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq


def detect_ndjson(path: str, ndjson_flag: Optional[bool]) -> bool:
    if ndjson_flag is not None:
        return ndjson_flag
    with open(path, "r", encoding="utf-8") as fh:
        # skip whitespace
        while True:
            ch = fh.read(1)
            if not ch:
                return True
            if ch.isspace():
                continue
            return ch != '['


def iter_json_array(path: str, limit: Optional[int] = None) -> Iterator[Dict[str, Any]]:
    if ijson is None:
        raise RuntimeError("ijson is required to stream JSON arrays. Install with `pip install ijson`.")
    with open(path, "r", encoding="utf-8") as fh:
        for i, obj in enumerate(ijson.items(fh, "item")):
            yield obj
            if limit is not None and i + 1 >= limit:
                break


def iter_ndjson(path: str, limit: Optional[int] = None) -> Iterator[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as fh:
        for i, line in enumerate(fh):
            line = line.strip()
            if not line:
                continue
            yield json.loads(line)
            if limit is not None and i + 1 >= limit:
                break


def write_batches(records_iter: Iterator[Dict[str, Any]], output_path: str, batch_size: int = 10000, overwrite: bool = False):
    if os.path.exists(output_path) and not overwrite:
        raise FileExistsError(f"Output file {output_path} already exists. Use --overwrite to replace.")

    writer: Optional[pq.ParquetWriter] = None
    total = 0
    batch = []

    for rec in records_iter:
        batch.append(rec)
        if len(batch) >= batch_size:
            df = pd.DataFrame(batch)
            table = pa.Table.from_pandas(df)
            if writer is None:
                # create parent dir
                os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
                writer = pq.ParquetWriter(output_path, table.schema)
            writer.write_table(table)
            total += len(batch)
            print(f"Wrote {total} rows...")
            batch = []

    # final partial batch
    if batch:
        df = pd.DataFrame(batch)
        table = pa.Table.from_pandas(df)
        if writer is None:
            os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
            writer = pq.ParquetWriter(output_path, table.schema)
        writer.write_table(table)
        total += len(batch)
        print(f"Wrote {total} rows (final).")

    if writer is not None:
        writer.close()


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Stream JSON/NDJSON into Parquet in batches")
    p.add_argument("--input", "-i", required=True, help="Path to input JSON (array or NDJSON)")
    p.add_argument("--output", "-o", required=False, help="Output parquet path. If omitted, same name with .parquet")
    p.add_argument("--ndjson", action="store_true", help="Force treat input as NDJSON (one JSON object per line)")
    p.add_argument("--batch-size", type=int, default=10000, help="Number of records per write batch")
    p.add_argument("--lines", type=int, default=None, help="Optional: limit to first N lines/records for testing")
    p.add_argument("--overwrite", action="store_true", help="Overwrite output file if it exists")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    inp = args.input
    out = args.output or os.path.splitext(inp)[0] + ".parquet"

    is_ndjson = detect_ndjson(inp, args.ndjson)
    print(f"Input: {inp}\nOutput: {out}\nDetected NDJSON: {is_ndjson}\nBatch size: {args.batch_size}")

    if is_ndjson:
        records = iter_ndjson(inp, limit=args.lines)
    else:
        records = iter_json_array(inp, limit=args.lines)

    try:
        write_batches(records, out, batch_size=args.batch_size, overwrite=args.overwrite)
    except Exception as exc:
        print(f"Error during conversion: {exc}", file=sys.stderr)
        return 2

    print("Conversion completed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
