import tkinter as tk
from tkinter import filedialog, messagebox, font
import sys
import os
import requests
import webbrowser
import calendar
from datetime import datetime

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# create main window
root = tk.Tk()
root.title("PixelScript+")
root.geometry("600x400")
root.iconphoto(True, tk.PhotoImage(file=resource_path("Icon.png")))

# text area
current_font = font.Font(family="Arial", size=12)
text_area = tk.Text(root, wrap="word", undo=True, font=current_font)
text_area.pack(fill="both", expand=True)

# GitHub update check
OWNER = "Northy2410"
REPO = "PixelScript-Plus"
CURRENT_VERSION = "1.2"

def check_for_update():
    url = f"https://api.github.com/repos/northy2410/pixelscript-plus/releases/latest"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        latest_release = response.json()
        latest_version = latest_release["tag_name"].lstrip("vV") 
        if latest_version != CURRENT_VERSION:
            def open_release():
                webbrowser.open(latest_release['html_url'])
            update_win = tk.Toplevel(root)
            update_win.title("New Update Available")
            update_win.geometry("350x150")
            update_win.resizable(False, False)
            update_win.attributes("-topmost", True)  # Always on top
            msg = tk.Label(
                update_win,
                text=f"New update available!\n\nLatest: {latest_version}\nYou have: {CURRENT_VERSION}",
                font=("Arial", 12)
            )
            msg.pack(pady=15)
            btn = tk.Button(
                update_win,
                text="Open Release Page",
                command=open_release,
                font=("Arial", 11)
            )
            btn.pack(pady=5)
            close_btn = tk.Button(
                update_win,
                text="Close",
                command=update_win.destroy,
                font=("Arial", 10)
            )
            close_btn.pack(pady=5)
        # Do nothing if up to date
    except Exception as e:
        pass  # Silently ignore errors
        
if __name__ == "__main__":
    check_for_update()

# file functions
def new_file():
    text_area.delete(1.0, tk.END)

def open_file():
    file = filedialog.askopenfilename(filetypes=[("Text Files", "*.txt")])
    if file:
        with open(file, "r") as f:
            text_area.delete(1.0, tk.END)
            text_area.insert(tk.END, f.read())

def save_file():
    file = filedialog.asksaveasfilename(defaultextension=".txt",
                                        filetypes=[("Text Files", "*.txt")])
    if file:
        with open(file, "w") as f:
            f.write(text_area.get(1.0, tk.END))
        messagebox.showinfo("Saved", "File saved successfully!")

# font functions
def set_font_family(family):
    current_font.config(family=family)

def set_font_size(size):
    current_font.config(size=size)

def toggle_bold():
    if current_font.actual()['weight'] == 'normal':
        current_font.config(weight='bold')
    else:
        current_font.config(weight='normal')

def toggle_italic():
    if current_font.actual()['slant'] == 'roman':
        current_font.config(slant='italic')
    else:
        current_font.config(slant='roman')

# Calculator functions
def open_calculator():
    calc_win = tk.Toplevel(root)
    calc_win.title("Calculator")
    calc_win.geometry("300x410")

    entry = tk.Entry(calc_win, width=20, font=('Arial', 16), borderwidth=5, relief='ridge')
    entry.grid(row=0, column=0, columnspan=4, pady=10)

    def click(btn):
        entry.insert(tk.END, btn)
        
    def clear():
        entry.delete(0, tk.END)

    def calculate():
        try:
            result = eval(entry.get())
            entry.delete(0, tk.END)
            entry.insert(0, str(result))
        except Exception:
            entry.delete(0, tk.END)
            entry.insert(0, "Error")

    # Buttons layout
    buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ]

    row_val, col_val = 1, 0
    for btn in buttons:
        if btn == '=':
            b = tk.Button(calc_win, text=btn, width=5, height=2, font=('Arial', 14), command=calculate)
        else:
            b = tk.Button(calc_win, text=btn, width=5, height=2, font=('Arial', 14), command=lambda x=btn: click(x))
        b.grid(row=row_val, column=col_val, padx=5, pady=5)
        col_val += 1
        if col_val > 3:
            col_val = 0
            row_val += 1

    # Clear button
    clear_btn = tk.Button(calc_win, text='C', width=5, height=2, font=('Arial', 14), command=clear)
    clear_btn.grid(row=row_val, column=0, padx=5, pady=5)

# Calendar function
def open_calendar():
    cal_win = tk.Toplevel(root)
    cal_win.title("Calendar")
    cal_win.geometry("260x320")
    cal_win.resizable(False, False)

    now = datetime.now()
    year_var = tk.IntVar(value=now.year)
    month_var = tk.IntVar(value=now.month)
    selected_day = tk.IntVar(value=now.day)

    # Month and Year display (more visible)
    header_frame = tk.Frame(cal_win)
    header_frame.pack(pady=8)
    tk.Button(header_frame, text="<", width=2, command=lambda: prev_month()).pack(side="left")

    month_year_label = tk.Label(
        header_frame,
        text=f"{calendar.month_name[month_var.get()]} {year_var.get()}",
        font=('Arial', 14, 'bold'),
        width=15,
        anchor="center"
    )
    month_year_label.pack(side="left", padx=5)

    tk.Button(header_frame, text=">", width=2, command=lambda: next_month()).pack(side="left")

    days_frame = tk.Frame(cal_win)
    days_frame.pack(pady=10)

    def draw_calendar():
        # Update month/year label
        month_year_label.config(text=f"{calendar.month_name[month_var.get()]} {year_var.get()}")
        for widget in days_frame.winfo_children():
            widget.destroy()
        year = year_var.get()
        month = month_var.get()
        cal = calendar.monthcalendar(year, month)
        # Weekday headers
        for i, day in enumerate(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']):
            tk.Label(days_frame, text=day, width=3, font=('Arial', 9, 'bold')).grid(row=0, column=i)
        # Days
        for r, week in enumerate(cal, 1):
            for c, day in enumerate(week):
                if day == 0:
                    tk.Label(days_frame, text="", width=3).grid(row=r, column=c)
                else:
                    b = tk.Radiobutton(
                        days_frame, text=str(day), width=3, variable=selected_day, value=day,
                        indicatoron=0, font=('Arial', 9)
                    )
                    b.grid(row=r, column=c)

    def prev_month():
        m, y = month_var.get(), year_var.get()
        if m == 1:
            month_var.set(12)
            year_var.set(y - 1)
        else:
            month_var.set(m - 1)
        draw_calendar()

    def next_month():
        m, y = month_var.get(), year_var.get()
        if m == 12:
            month_var.set(1)
            year_var.set(y + 1)
        else:
            month_var.set(m + 1)
        draw_calendar()

    def show_date():
        y, m, d = year_var.get(), month_var.get(), selected_day.get()
        if d == 0:
            messagebox.showwarning("No Date", "Please select a day.")
        else:
            date_str = f"{y}-{m:02d}-{d:02d}"
            # Insert date into the text area at the current cursor position
            text_area.insert(tk.INSERT, date_str)
            cal_win.destroy()

    tk.Button(cal_win, text="Insert Date", command=show_date).pack(pady=10)

    draw_calendar()

# menu bar
menu_bar = tk.Menu(root)

# file menu
file_menu = tk.Menu(menu_bar, tearoff=0)
file_menu.add_command(label="New", command=new_file)
file_menu.add_command(label="Open", command=open_file)
file_menu.add_command(label="Save", command=save_file)
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.quit)
menu_bar.add_cascade(label="File", menu=file_menu)

# edit menu
edit_menu = tk.Menu(menu_bar, tearoff=0)

# font family
font_menu = tk.Menu(edit_menu, tearoff=0)
for family in ["Arial", "Courier", "Times New Roman", "Verdana"]:
    font_menu.add_command(label=family, command=lambda f=family: set_font_family(f))

# font size
size_menu = tk.Menu(edit_menu, tearoff=0)
for size in [10, 12, 14, 16, 18, 20, 24]:
    size_menu.add_command(label=str(size), command=lambda s=size: set_font_size(s))

# add to edit menu
edit_menu.add_cascade(label="Font Family", menu=font_menu)
edit_menu.add_cascade(label="Font Size", menu=size_menu)
edit_menu.add_command(label="Bold", command=toggle_bold)
edit_menu.add_command(label="Italic", command=toggle_italic)
menu_bar.add_cascade(label="Edit", menu=edit_menu)

# maths menu
maths_menu = tk.Menu(menu_bar, tearoff=0)
maths_menu.add_command(label="Calculator", command=open_calculator)
menu_bar.add_cascade(label="Maths", menu=maths_menu)

# utilities menu
utilities_menu = tk.Menu(menu_bar, tearoff=0)
utilities_menu.add_command(label="Calendar", command=open_calendar)
menu_bar.add_cascade(label="Utilities", menu=utilities_menu)

root.config(menu=menu_bar)
root.mainloop()
