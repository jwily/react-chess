from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text


def seed_games():

    old_demo = Game.query.filter(Game.code == 'demonstrate').first()
    old_castling = Game.query.filter(Game.code == 'castling').first()
    old_en_passant = Game.query.filter(Game.code == 'enpassant').first()

    old_matches = [old_demo, old_castling, old_en_passant]

    for match in old_matches:
        if not match is None:
            db.session.delete(match)

    new_demo = Game(code='demonstrate')
    new_castling = Game(code='castling',
                        board=[
                            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                        ])
    new_en_passant = Game(code='enpassant',
                          board=[
                              ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                              ['p', '_', 'p', '_', 'p', 'p', 'p', 'p'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', 'P', '_', 'P', '_'],
                              ['_', 'p', '_', 'p', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['P', 'P', 'P', 'P', '_', 'P', '_', 'P'],
                              ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                          ])

    db.session.commit()


def undo_games():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute('TRUNCATE games RESTART IDENTITY CASCADE;')
    db.session.commit()
