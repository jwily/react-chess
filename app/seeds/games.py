from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text


def seed_games():
    demo_game = Game(code='demo')
    db.session.add(demo_game)
    db.session.commit()


def undo_games():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute('TRUNCATE games RESTART IDENTITY CASCADE;')
    db.session.commit()
