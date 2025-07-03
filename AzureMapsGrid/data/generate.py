import csv
import random
import argparse
import os

def generate_random_hex_color():
    return "#{:06X}".format(random.randint(0, 0xFFFFFF))

def generate_data(
    count,
    item_types,
    categories,
    lat_min,
    lat_max,
    long_min,
    long_max
):
    records = []
    for i in range(1, count + 1):
        item_type = random.choice(item_types)
        category = random.choice(categories)
        lat = round(random.uniform(lat_min, lat_max), 6)
        lon = round(random.uniform(long_min, long_max), 6)
        color = generate_random_hex_color()
        name = f"{item_type}-{i:04d}"
        description = item_type
        records.append({
            "Name": name,
            "Description": description,
            "Lat": lat,
            "Long": lon,
            "Color": color,
            "Category": category
        })
    return records

def write_locations_csv(filename, records):
    with open(filename, mode='w', newline='') as csvfile:
        fieldnames = ["Name", "Description", "Lat", "Long", "Color", "Category"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            writer.writerow(record)

def write_categories_csv(filename, categories):
    with open(filename, mode='w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Category"])
        for category in sorted(set(categories)):
            writer.writerow([category])

def write_powerapps_table(filename, records):
    with open(filename, mode='w') as txtfile:
        txtfile.write("Table(\n")
        for i, record in enumerate(records):
            line = (
                f'    {{Name:"{record["Name"]}", Description:"{record["Description"]}", '
                f'Lat:{record["Lat"]}, Long:{record["Long"]}, Color:"{record["Color"]}", '
                f'Category:"{record["Category"]}"}}'
            )
            if i < len(records) - 1:
                line += ","
            txtfile.write(line + "\n")
        txtfile.write(")\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate synthetic utility asset data for testing."
    )
    parser.add_argument(
        "num_records",
        nargs="?",
        type=int,
        default=250,
        help="Number of records to generate"
    )
    parser.add_argument(
        "--item-types",
        nargs="+",
        default=["Pole", "Meter", "Transformer"],
        help="List of item types (default: Pole Meter Transformer)"
    )
    parser.add_argument(
        "--categories",
        nargs="+",
        default=["Active", "Maintenance", "Retired"],
        help="List of categories (default: Active Maintenance Retired)"
    )
    parser.add_argument(
        "--lat-min",
        type=float,
        default=38.4,
        help="Minimum latitude (default: 38.4)"
    )
    parser.add_argument(
        "--lat-max",
        type=float,
        default=41.98,
        help="Maximum latitude (default: 41.98)"
    )
    parser.add_argument(
        "--long-min",
        type=float,
        default=-84.82,
        help="Minimum longitude (default: -84.82)"
    )
    parser.add_argument(
        "--long-max",
        type=float,
        default=-80.52,
        help="Maximum longitude (default: -80.52)"
    )

    args = parser.parse_args()    

    # --- GENERATE DATA ---
    data = generate_data(
        count=args.num_records,
        item_types=args.item_types,
        categories=args.categories,
        lat_min=args.lat_min,
        lat_max=args.lat_max,
        long_min=args.long_min,
        long_max=args.long_max
    )

    # Determine script's own directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Output paths
    LOCATIONS_OUTPUT_FILE = os.path.join(script_dir, "utility_locations.csv")
    CATEGORIES_OUTPUT_FILE = os.path.join(script_dir, "utility_categories.csv")
    POWERAPPS_TABLE_FILE = os.path.join(script_dir, "utility_powerapps_table.txt")

    # --- SAVE FILES ---
    write_locations_csv(LOCATIONS_OUTPUT_FILE, data)
    write_categories_csv(CATEGORIES_OUTPUT_FILE, args.categories)
    write_powerapps_table(POWERAPPS_TABLE_FILE, data)

    print(f"✅ Generated {args.num_records} location records and saved to '{LOCATIONS_OUTPUT_FILE}'")
    print(f"✅ Saved categories list to '{CATEGORIES_OUTPUT_FILE}'")
    print(f"✅ Saved PowerApps Table() definition to '{POWERAPPS_TABLE_FILE}'")
