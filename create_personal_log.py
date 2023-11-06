# Created on Thu Sep 28 2023
# Copyright (c) 2023 Connor Doman

import datetime
import argparse
from pathlib import Path

WEEKLY_LOG_PATH = Path(__file__).parent.resolve()
TEMPLATE_FILE_PATH = Path(WEEKLY_LOG_PATH / "log_template.md")


def get_list(question: str, end: str = "done"):
    print(f"Type '{end}' to finish.")
    gathered_list = []
    print(question)
    while (msg := input("-   ")) != end:
        gathered_list.append(msg)
    return gathered_list


def replace_by_dictionary(line: str, token_translations: dict):
    for token, replacement in token_translations.items():
        if line.startswith("??"):
            if replacement and line.startswith(token):
                line = line.replace(token, "", 1)
                line = line.replace(token, replacement)

        line = line.replace("{" + token + "}", replacement)
    return line


def print_underlined(*args):
    print(*args)
    print("=" * len(" ".join(args)))


def prepare_folders(name: str, name_lower: str):
    # Find the right log file path
    logfile_path = Path(__file__).parent.absolute()
    file_name = name + ".md"
    logfile_path = Path(logfile_path / WEEKLY_LOG_PATH / file_name)

    save_action = ""
    if logfile_path.exists():
        print("Log file already exists, adding to log...")
        save_action = "updated"
        # sys.exit(1)
    elif not logfile_path.exists():
        if not logfile_path.parent.exists():
            print(f"Creating path to log file: {WEEKLY_LOG_PATH}")
            logfile_path.parent.mkdir(parents=True, exist_ok=True)

        print(f"Creating log file: {logfile_path}")
        logfile_path.touch()
        save_action = "created"

    # Ensure tasks directory exists
    tasks_folder = Path(logfile_path.parent / "tasks" / name_lower)
    tasks_folder.mkdir(parents=True, exist_ok=True)

    return save_action, logfile_path


def collect_tasks_completed(replace_dict: dict):
    print_underlined("\nTasks Completed")
    # Generate tasks list
    print("Entering tasks...\nType 'done' to finish.")
    tasks = []

    task_num = input("Enter a task number: #")
    msg = input(f"Enter a description:\n#{task_num} -> ")
    while msg != "done" and task_num != "done":
        if msg.strip() == "" or task_num.strip() == "":
            print("You gotta complete a task every week.")
            continue

        task_num = replace_by_dictionary(task_num, replace_dict)
        tasks.append("-   #" + task_num + " -> " + msg)

        task_num = input("Enter a task number: #")
        if task_num != "done":
            msg = input(f"Enter a description:\n#{task_num} -> ")
    return tasks


def collect_work_summary(replace_dict: dict):
    print_underlined("\nWork Summary")
    # Generate work summary
    print("Entering work summary...")
    list_or_not = input("Would you like to enter as a list? (y/n) ")
    work_question = "Where did you make progress this week?"
    work_items = []

    if list_or_not == "y":
        work_items = [
            "-   " + replace_by_dictionary(item, replace_dict)
            for item in get_list(work_question)
        ]
    else:
        work_items = [input(f"{work_question}\n> ")]

    return work_items


def collect_additional_notes():
    print_underlined("\nAdditional Notes")
    # Generate additional notes
    notes = input("Would you like to enter any additional notes? (y/n) ")
    if notes == "y":
        notes = input("Enter additional notes:\n> ")
    else:
        notes = "No additional notes."
    return notes


def write_to_file(logfile_path: str, save_action: str, token_translations: str):
    with open(TEMPLATE_FILE_PATH, "r") as template_file:
        template = template_file.readlines()

        # Write to file:
        with open(logfile_path, "a") as f:
            for i, line in enumerate(template + ["\n"]):
                if i == 0 and save_action != "created":
                    continue
                line = replace_by_dictionary(line, token_translations)
                if line:
                    f.write(line)

        print(f"Log file {save_action} at: " + str(logfile_path))


def weekly_log(
    name: str,
    current_datetime: datetime.datetime,
):
    # Cardinal date should be in YYYY-MM-DD format
    cardinal_date = current_datetime.strftime("%Y-%m-%d")
    # Readable date should be in MONTH DD, YYYY format
    readable_date = current_datetime.strftime("%B %d, %Y")

    # Get name if not provided
    if not name:
        name = input("What is your name? ")
    name_lower = name.strip().split(" ")[0].lower()
    name_capitalized = name_lower.capitalize()

    # Intro
    print_underlined("Weekly Progress Report Generator")

    # Prepare folders
    save_action, logfile_path = prepare_folders(name, name_lower)

    # Get path to tasks image
    tasks_image = input(
        f"Please enter the path to your tasks image: /tasks/{name_lower}/"
    )

    # Print header
    print_underlined(f"Personal Log for {name_capitalized} (Team 1)")
    print(readable_date)

    # Get tasks list
    tasks_list = "\n".join(collect_tasks_completed({"name": name_capitalized}))

    # Get work summary
    work_summary = "\n".join(collect_work_summary({"name": name_capitalized}))

    # Get additional notes
    additional_notes = collect_additional_notes()

    # Replacement dictionary
    token_translations = {
        "name_lower": name_lower,
        "name_capitalized": name_capitalized,
        "readable_date": readable_date,
        "tasks_image": tasks_image,
        "tasks_list": tasks_list,
        "work_summary": work_summary,
        "additional_notes": additional_notes,
        "short_date": cardinal_date,
    }

    # Write to file
    write_to_file(logfile_path, save_action, token_translations)


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--name", help="Name of the log file", action="store")
    parser.add_argument(
        "-t",
        "--template",
        help="Specify an alternate markdown template to use",
        action="store",
    )
    parser.add_argument(
        "-d",
        "--date",
        "--cardinal-date",
        help="Specify a cardinal date (YYYY-MM-DD)",
        action="store",
    )
    args = parser.parse_args()

    # Questionnaire process:
    # 1. What is your name?
    # 2. What is the date?
    # 3. Please list your tasks completed for the week:
    #   - Enter task number, task name, and task description
    # 4. Please enter your Work Summary:
    #   - What did you complete this week?
    #   - How did you overcome any obstacles?
    #   - Did you learn anything new?
    #   - Did you complete any features?

    # Get name from command line arguments
    name: str = args.name

    # Get current date:
    now = datetime.datetime.now()
    if args.date:
        now = datetime.datetime.strptime(args.date, "%Y-%m-%d")

    # Generate log
    weekly_log(name, now)


if __name__ == "__main__":
    main()
