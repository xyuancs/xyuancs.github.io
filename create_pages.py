#!/usr/bin/env python3
import re

# Shared CSS and navigation template
NAV_TEMPLATE = '''    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">Xingliang Yuan</a>
            <button class="mobile-menu-toggle">☰</button>
            <ul class="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="research.html" class="active">Research</a></li>
                <li><a href="people.html">People</a></li>
                <li><a href="teaching.html">Teaching</a></li>
                <li><a href="service.html">Services</a></li>
                <li><a href="talk.html">Talks</a></li>
                <li><a href="award.html">Awards</a></li>
            </ul>
        </div>
    </nav>'''

# Read the CSS from index.html
with open('index.html', 'r') as f:
    index_content = f.read()
    # Extract CSS (between <style> and </style>)
    css_match = re.search(r'<style>(.*?)</style>', index_content, re.DOTALL)
    if css_match:
        CSS = css_match.group(1)
        print("CSS extracted successfully")
    else:
        print("Error: Could not extract CSS")
        exit(1)

# Read index.html to get the full HTML structure
with open('index.html', 'r') as f:
    full_index = f.read()
    # Extract head section
    head_match = re.search(r'(<head>.*?</head>)', full_index, re.DOTALL)
    if head_match:
        HEAD = head_match.group(1)
    else:
        print("Error: Could not extract HEAD")
        exit(1)
    
    # Extract footer
    footer_match = re.search(r'(<footer.*?</footer>)', full_index, re.DOTALL)
    if footer_match:
        FOOTER = footer_match.group(1)
    else:
        FOOTER = '''    <footer class="footer">
        <div class="container">
            <p>Last Update: August, 2025</p>
        </div>
    </footer>'''

print("Templates extracted successfully")
