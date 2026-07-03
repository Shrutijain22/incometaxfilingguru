import os
import glob

# Files to process
html_files = glob.glob("C:/Users/HP/.gemini/antigravity-ide/scratch/tax-return-australia/*.html")

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Remove phone and email from the header
    # The top-bar contains top-contact-links and top-social-links. 
    # If we just remove the top-bar entirely, it cleans up the header.
    # The user said "rmeove the phone and email from the header". 
    # Let's remove the whole top-bar div because without email/phone, it just has social links.
    # Actually, let's just remove the top-contact-links div content.
    import re
    content = re.sub(
        r'<div class="top-contact-links">.*?</div>', 
        '<div class="top-contact-links"></div>', 
        content, 
        flags=re.DOTALL
    )
    
    # 2. Change "Free Checklist" to "Tax Deduction Checklist"
    content = content.replace("Free Checklist", "Tax Deduction Checklist")
    
    # Write back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated HTML headers and nav links.")
