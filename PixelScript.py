import tkinter as tk
from tkinter import filedialog, messagebox, font
import sys
import os

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
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
    calc_win.geometry("300x400")

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

root.config(menu=menu_bar)
root.mainloop()

