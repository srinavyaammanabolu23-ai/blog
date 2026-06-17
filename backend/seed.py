import asyncio
import re
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment  # noqa: F401 — needed to resolve relationships
from app.models.vote import Vote        # noqa: F401 — needed to resolve relationships
from app.core.security import hash_password


def make_slug(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


async def seed_db():
    db = SessionLocal()
    try:
        # ── Users ─────────────────────────────────────────────────────────────
        def get_or_create_user(username, role, email):
            user = db.query(User).filter(User.username == username).first()
            if not user:
                user = User(
                    username=username,
                    email=email,
                    hashed_password=hash_password("password"),
                    role=role,
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            return user

        admin   = get_or_create_user("neo_admin", "admin", "admin@blogflow.dev")
        author1 = get_or_create_user("pixel_poet", "author", "pixel@blogflow.dev")
        author2 = get_or_create_user("byte_brutalist", "author", "byte@blogflow.dev")

        # ── Posts ─────────────────────────────────────────────────────────────
        posts_data = [
            # 1 ──────────────────────────────────────────────────────────────
            {
                "title": "EMBRACE THE CHAOS",
                "summary": "Why soft shadows and gradients are ruining the web, and how Neo-Brutalism brings back raw authenticity.",
                "author": admin,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "The modern web is **too safe**. Every startup ships the same soft gray "
                                "borders, the same gentle drop shadows, and the same rounded corners. "
                                "It's time for a change.\n\n"
                                "Neo-Brutalism strips away the pretense. It exposes the raw structure "
                                "of the digital world. It's loud, it's unapologetic, and it's highly functional."
                            )
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "THE RULES OF BRUTALISM", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "1. **Contrast is King:** Black borders on white backgrounds.\n"
                                "2. **Solid Shadows:** No blur. Offset the shadow and fill it with pure black.\n"
                                "3. **Monospaced Accents:** Bring back the terminal aesthetic.\n"
                                "4. **Neon on Beige:** Let your accent colour scream."
                            )
                        },
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "css",
                            "code": (
                                ".brutal-card {\n"
                                "  border: 4px solid #000;\n"
                                "  box-shadow: 8px 8px 0px #000;\n"
                                "  border-radius: 0;\n"
                                "  background: #fff;\n"
                                "}"
                            ),
                        },
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Stop A/B testing your button radius. Start designing with **conviction**. "
                                "The web deserves more than beige."
                            )
                        },
                    },
                ],
            },
            # 2 ──────────────────────────────────────────────────────────────
            {
                "title": "THE FUTURE IS TERMINAL",
                "summary": "Command Line Interfaces are making a bold comeback in modern SaaS tools—and power users are loving it.",
                "author": author2,
                "blocks": [
                    {
                        "type": "header",
                        "data": {"text": "A RETURN TO FORM", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "GUIs made computing accessible. CLIs made computing **powerful**. "
                                "As power users demand more speed, we are seeing a resurgence of "
                                "command palettes, keyboard-first navigation, and even full terminal "
                                "UIs embedded directly in web apps."
                            )
                        },
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "bash",
                            "code": (
                                "$ npm install the-future\n"
                                "> Fetching dependencies...\n"
                                "> Building the brutalist web...\n"
                                "> Done in 0.42s ✓"
                            ),
                        },
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Tools like **Linear**, **Vercel**, and **Raycast** have proven that "
                                "the terminal aesthetic resonates deeply with developers. "
                                "The monospace font is not a relic—it's a statement."
                            )
                        },
                    },
                ],
            },
            # 3 ──────────────────────────────────────────────────────────────
            {
                "title": "CYBERPUNK AESTHETICS",
                "summary": "Exploring the neon-lit, high-tech low-life visual style that defined a generation of designers.",
                "author": author1,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Cyberpunk isn't just a sci-fi subgenre—it's a design language. "
                                "It combines the grime of an overpopulated metropolis with the "
                                "hyper-vibrant glow of neon advertisements."
                            )
                        },
                    },
                    {
                        "type": "media",
                        "data": {
                            "url": "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200&auto=format&fit=crop",
                            "caption": "Neon Cityscape — the visual grammar of Cyberpunk",
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "COLOUR AS SIGNAL", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "In a cyberpunk palette, **cyan and magenta** are not accents—they are "
                                "the primary language. They cut through the darkness with surgical precision. "
                                "When you apply this to UI design, you get interfaces that feel alive, urgent, "
                                "and impossible to ignore."
                            )
                        },
                    },
                ],
            },
            # 4 ──────────────────────────────────────────────────────────────
            {
                "title": "TYPOGRAPHY IS NOT DECORATION",
                "summary": "How the right typeface can completely transform a product's personality and its users' trust.",
                "author": author1,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Most designers treat typography as a finishing touch—something you pick "
                                "from a dropdown after the layout is done. This is **a catastrophic mistake**.\n\n"
                                "Typography IS the design. It determines how information flows, how urgency "
                                "is communicated, and how much a user trusts the product before a single "
                                "pixel of UI chrome is rendered."
                            )
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "SYNE — THE BRUALIST DISPLAY FONT", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "**Syne** was designed for headline use at extreme weights. Its wide "
                                "letterforms and tightly-spaced uppercase characters give text an "
                                "architectural quality—like words are structures, not just letters.\n\n"
                                "Pair it with **JetBrains Mono** for body labels, and you have a system "
                                "that feels both raw and highly engineered."
                            )
                        },
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "css",
                            "code": (
                                "@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;800&family=JetBrains+Mono:wght@400;600&display=swap');\n\n"
                                ":root {\n"
                                "  --font-display: 'Syne', sans-serif;\n"
                                "  --font-mono:    'JetBrains Mono', monospace;\n"
                                "}"
                            ),
                        },
                    },
                ],
            },
            # 5 ──────────────────────────────────────────────────────────────
            {
                "title": "THE OPEN SOURCE GOSPEL",
                "summary": "Why transparency, community, and radical sharing are the most disruptive forces in modern software.",
                "author": author2,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "In 1983, Richard Stallman published the GNU Manifesto. "
                                "In 1991, Linus Torvalds released Linux with a casual message to a mailing list. "
                                "In 2005, Linus Torvalds built Git in two weeks because he was annoyed.\n\n"
                                "**Open source is not a business model. It is a philosophy of radical generosity.**"
                            )
                        },
                    },
                    {
                        "type": "media",
                        "data": {
                            "url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                            "caption": "Code is a conversation across time",
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "WHY IT MATTERS NOW MORE THAN EVER", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "As AI-generated code floods the ecosystem, the open source model is our "
                                "last line of **auditability**. When a codebase is closed, trust is impossible. "
                                "When it is open, trust is earned line by line.\n\n"
                                "Fork it. Audit it. Contribute back. That's the deal."
                            )
                        },
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "bash",
                            "code": (
                                "$ git clone https://github.com/torvalds/linux\n"
                                "$ cd linux\n"
                                "$ wc -l **/*.c\n"
                                "# 28,000,000+ lines of open collaboration"
                            ),
                        },
                    },
                ],
            },
            # 6 ──────────────────────────────────────────────────────────────
            {
                "title": "COLOUR THEORY FOR REBELS",
                "summary": "Ditch the safe palette generators. Here's how to build a colour system that provokes and delights.",
                "author": admin,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Every design tool ships with a palette generator. Every palette generator "
                                "produces the same **muted, accessible, thoroughly inoffensive** colours. "
                                "The result? A web full of identical products that evoke zero emotion.\n\n"
                                "Rebels don't use palette generators. They start with a single, screaming "
                                "accent and build outward."
                            )
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "THE NEON RULE", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Pick one neon. ONE. It can be `#ccff00` (acid green), `#ff00ff` (hot pink), "
                                "or `#00e5ff` (electric cyan). Now contrast it against pure black or pure "
                                "white. Never use it for body text. Only for **signals**: active states, "
                                "highlights, badges, and calls to action."
                            )
                        },
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "css",
                            "code": (
                                "/* The Brutalist Palette */\n"
                                "--bg-base:    #f4f4f0;  /* Off-white canvas */\n"
                                "--accent-1:   #ccff00;  /* Neon Yellow — PRIMARY SIGNAL */\n"
                                "--accent-2:   #ff00ff;  /* Hot Pink — DANGER / EMPHASIS */\n"
                                "--accent-3:   #00e5ff;  /* Cyan — INFO / SECONDARY */\n"
                                "--text-ink:   #000000;  /* Pure black — no softening */"
                            ),
                        },
                    },
                ],
            },
            # 7 ──────────────────────────────────────────────────────────────
            {
                "title": "GRIDS ARE MEANT TO BE BROKEN",
                "summary": "A deep dive into the history of grid systems and why the best designers know exactly when to shatter them.",
                "author": author1,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "The grid is a promise to the reader: *everything has a place, everything "
                                "is in order*. Swiss designers in the 1950s codified it. The Bauhaus "
                                "evangelised it. Today, CSS Grid makes it trivially easy to implement.\n\n"
                                "So why do the most memorable designs **break the grid**?"
                            )
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "CONTROLLED CHAOS", "level": 2},
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "Breaking the grid only works when you first **master it**. "
                                "David Carson's Ray Gun magazine was chaotic—but Carson could set "
                                "perfect Helvetica in his sleep. His chaos was intentional, informed, "
                                "and deeply readable once you surrendered to it.\n\n"
                                "In web design, a hero element that bleeds past the container, "
                                "a label rotated 90°, or a header that ignores the column gutter—"
                                "these create tension that makes a user **stop and look**."
                            )
                        },
                    },
                    {
                        "type": "media",
                        "data": {
                            "url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
                            "caption": "Architecture and grid systems share the same DNA",
                        },
                    },
                ],
            },
            # 8 ──────────────────────────────────────────────────────────────
            {
                "title": "THE WEB IS AN ENGINEERING ACHIEVEMENT",
                "summary": "We forget how astonishing the browser is. Let's slow down and appreciate the stack that makes it all possible.",
                "author": author2,
                "blocks": [
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "When you type a URL and press Enter, you trigger a sequence of events "
                                "so complex that entire textbooks have been written about each individual "
                                "layer. **And it happens in under 200 milliseconds**.\n\n"
                                "DNS resolution. TCP handshake. TLS negotiation. HTTP/2 multiplexing. "
                                "HTML parsing. CSS cascade. JavaScript engine bytecode compilation. "
                                "GPU compositing. Vsync.\n\n"
                                "We build on this every day and call it *\"just a web app\"*."
                            )
                        },
                    },
                    {
                        "type": "header",
                        "data": {"text": "THE LAYERS BENEATH", "level": 2},
                    },
                    {
                        "type": "code",
                        "data": {
                            "language": "text",
                            "code": (
                                "User types URL\n"
                                "  └── DNS Lookup        (< 1ms cached)\n"
                                "  └── TCP Handshake     (1 RTT)\n"
                                "  └── TLS 1.3 Handshake (1 RTT)\n"
                                "  └── HTTP/2 GET        (compressed headers)\n"
                                "  └── HTML Parse → DOM\n"
                                "  └── CSS Parse → CSSOM\n"
                                "  └── Render Tree\n"
                                "  └── Layout → Paint → Composite\n"
                                "  └── 60fps on your screen"
                            ),
                        },
                    },
                    {
                        "type": "richtext",
                        "data": {
                            "content": (
                                "The next time your bundle is 2MB because you imported an animation library "
                                "to make a button wiggle, remember: the browser was handling a lot just to "
                                "get it to your user in the first place. **Respect the stack.**"
                            )
                        },
                    },
                ],
            },
        ]

        # ── Insert ────────────────────────────────────────────────────────────
        for p in posts_data:
            existing = db.query(Post).filter(Post.title == p["title"]).first()
            if not existing:
                post = Post(
                    title=p["title"],
                    slug=make_slug(p["title"]),
                    summary=p["summary"],
                    blocks=p["blocks"],
                    author_id=p["author"].id,
                )
                db.add(post)

        db.commit()
        print("✓ Mock data seeded successfully — 8 posts, 3 authors.")

    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(seed_db())
