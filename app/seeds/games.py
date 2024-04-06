from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text


def seed_games():

    old_demo = Game.query.filter(Game.code == 'demonstrate').first()
    old_castling = Game.query.filter(Game.code == 'castling').first()
    old_en_passant = Game.query.filter(Game.code == 'enpassant').first()
    old_promotion = Game.query.filter(Game.code == 'promotion').first()

    old_matches = [old_demo, old_castling, old_en_passant, old_promotion]

    for match in old_matches:
        if not match is None:
            db.session.delete(match)

    db.session.commit()

    new_demo = Game(code='demonstrate')
    new_castling = Game(code='castling',
                        board=[
                            ['r', '_', '_', '_', 'k', '_', '_', 'r'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['_', '_', '_', '_', '_', '_', '_', '_'],
                            ['R', '_', '_', '_', 'K', '_', '_', 'R']
                        ])
    new_en_passant = Game(code='enpassant',
                          board=[
                              ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                              ['p', '_', '_', '_', 'p', 'p', 'p', 'p'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['_', '_', 'p', '_', 'P', '_', 'P', '_'],
                              ['_', 'p', '_', 'p', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['P', 'P', 'P', 'P', '_', 'P', '_', 'P'],
                              ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                          ])
    new_promotion = Game(code='promotion',
                         board=[
                              ['_', '_', '_', '_', 'k', '_', '_', '_'],
                              ['P', '_', 'P', '_', '_', '_', 'P', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['_', '_', '_', '_', '_', '_', '_', '_'],
                              ['p', '_', 'p', '_', '_', '_', 'p', '_'],
                              ['_', '_', '_', '_', 'K', '_', '_', '_']
                         ])

    new_matches = [new_demo, new_castling, new_en_passant, new_promotion]

    for match in new_matches:
        db.session.add(match)

    db.session.commit()


def undo_games():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute('TRUNCATE games RESTART IDENTITY CASCADE;')
    db.session.commit()
