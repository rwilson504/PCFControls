import csv
import random
import argparse
import os
from datetime import datetime, timedelta

# List of lorem-ipsum style sentence fragments
LOREM_FRAGMENTS = [
    "Lorem ipsum dolor sit amet",
    "Consectetur adipiscing elit",
    "Sed do eiusmod tempor incididunt",
    "Ut labore et dolore magna aliqua",
    "Aliquam erat volutpat",
    "Vestibulum ante ipsum primis",
    "In faucibus orci luctus et",
    "Pellentesque habitant morbi tristique",
    "Nunc non blandit massa",
    "Duis ultricies lacus sed turpis",
    "Mauris in aliquam sem",
    "Curabitur non nulla sit amet",
    "Proin eget tortor risus",
    "Vivamus suscipit tortor eget felis",
    "Donec sollicitudin molestie malesuada",
    "Pellentesque in ipsum id orci porta dapibus"
]

def generate_lorem_description():
    num_sentences = random.randint(2, 4)
    sentences = random.sample(LOREM_FRAGMENTS, num_sentences)
    return ". ".join(sentences) + "."

def generate_unique_names(count):
    names = set()
    while len(names) < count:
        name = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=5))
        names.add(name)
    return list(names)

def generate_titles():
    return [
        "Engineer", "Manager", "Director", "Analyst",
        "Consultant", "Specialist", "Coordinator", "Lead", "Associate"
    ]

def generate_business_divisions(count):
    divisions = set()
    while len(divisions) < count:
        division = f"Division-{random.randint(1, 99)}"
        divisions.add(division)
    return list(divisions)

def generate_event_categories():
    return ["Meeting", "Event", "Travel", "PTO"]

def random_date(start, end):
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

def write_csv(filename, fieldnames, records):
    with open(filename, mode='w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            writer.writerow(record)

def write_powerapps_table(filename, records):
    with open(filename, mode='w') as txtfile:
        txtfile.write("Table(\n")
        for i, record in enumerate(records):
            line = (
                f'    {{Event:"{record["Event"]}", '
                f'Description:"{record["Description"]}", '
                f'Resource:"{record["Resource"]}", '
                f'Category:"{record["Category"]}", '
                f'StartDate:"{record["StartDate"]}", '
                f'EndDate:"{record["EndDate"]}"}}'
            )
            if i < len(records) - 1:
                line += ","
            txtfile.write(line + "\n")
        txtfile.write(")\n")

def main():
    parser = argparse.ArgumentParser(description="Generate synthetic calendar component data.")
    
    parser.add_argument(
        "--resources",
        type=int,
        default=50,
        help="Number of Resource records to generate (default: 50)"
    )
    parser.add_argument(
        "--categories",
        type=int,
        default=10,
        help="Number of Category records (Business Divisions) to generate (default: 10)"
    )
    parser.add_argument(
        "--events",
        type=int,
        default=200,
        help="Number of Event records to generate (default: 200)"
    )
    parser.add_argument(
        "--blank-resource-pct",
        type=float,
        default=10.0,
        help="Percent of Events with blank Resource (default: 10.0)"
    )
    parser.add_argument(
        "--blank-category-pct",
        type=float,
        default=10.0,
        help="Percent of Events with blank Category (default: 10.0)"
    )
    parser.add_argument(
        "--start-date",
        type=str,
        default="2024-01-01",
        help="Earliest event date (default: 2024-01-01)"
    )
    parser.add_argument(
        "--end-date",
        type=str,
        default="2024-12-31",
        help="Latest event date (default: 2024-12-31)"
    )

    args = parser.parse_args()

    # Determine script directory for output
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Generate Resources
    unique_names = generate_unique_names(args.resources)
    titles = generate_titles()
    resources = [{"Name": name, "Title": random.choice(titles)} for name in unique_names]

    # Generate Categories (Business Divisions) - used internally only
    business_divisions = generate_business_divisions(args.categories)

    # Event Categories (for Event table Category field)
    event_types = generate_event_categories()

    # Generate Events
    event_records = []
    start_range = datetime.strptime(args.start_date, "%Y-%m-%d")
    end_range = datetime.strptime(args.end_date, "%Y-%m-%d")

    for i in range(1, args.events + 1):
        event_name = f"Event-{i:04d}"
        description = generate_lorem_description()

        resource_field = random.choice(unique_names) if random.random() > (args.blank_resource_pct / 100.0) else ""
        category_field = random.choice(event_types) if random.random() > (args.blank_category_pct / 100.0) else ""

        # Decide event type
        if random.random() < 0.7:
            # Short meeting
            random_date_only = random_date(start_range, end_range)
            start_hour = random.randint(8, 17)
            start_minute = random.choice([0, 15, 30, 45])
            start_dt = datetime(
                year=random_date_only.year,
                month=random_date_only.month,
                day=random_date_only.day,
                hour=start_hour,
                minute=start_minute
            )
            duration_minutes = random.choice([
                15, 30, 45, 60, 75, 90, 105, 120,
                135, 150, 165, 180, 195, 210, 225, 240
            ])
            end_dt = start_dt + timedelta(minutes=duration_minutes)
        else:
            # Multi-day event
            start_dt = random_date(start_range, end_range)
            duration_days = random.randint(1, 5)
            end_dt = start_dt + timedelta(days=duration_days)
            start_dt = datetime(start_dt.year, start_dt.month, start_dt.day)
            end_dt = datetime(end_dt.year, end_dt.month, end_dt.day)

        event_records.append({
            "Event": event_name,
            "Description": description,
            "Resource": resource_field,
            "Category": category_field,
            "StartDate": start_dt.isoformat(),
            "EndDate": end_dt.isoformat()
        })

    # Write to CSVs
    resources_file = os.path.join(script_dir, "resources.csv")
    events_file = os.path.join(script_dir, "events.csv")
    powerapps_table_file = os.path.join(script_dir, "events_powerapps_table.txt")

    write_csv(resources_file, ["Name", "Title"], resources)
    write_csv(events_file, ["Event", "Description", "Resource", "Category", "StartDate", "EndDate"], event_records)
    write_powerapps_table(powerapps_table_file, event_records)

    print(f"✅ Created {len(resources)} resources in '{resources_file}'")
    print(f"✅ Created {len(event_records)} events in '{events_file}'")
    print(f"✅ Created PowerApps Table definition in '{powerapps_table_file}'")

if __name__ == "__main__":
    main()
