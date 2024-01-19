import string
import secrets

from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(12), nullable=False, unique=True, index=True)
    _board = db.Column(
        db.String(255), nullable=False, default='rnbqkbnrpppppppp32PPPPPPPPRNBQKBNR')

    white_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))
    black_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))

    turn = db.Column(db.String(5), nullable=False, default='white')

    white_can_long = db.Column(db.Boolean, nullable=False, default=True)
    white_can_short = db.Column(db.Boolean, nullable=False, default=True)
    black_can_long = db.Column(db.Boolean, nullable=False, default=True)
    black_can_short = db.Column(db.Boolean, nullable=False, default=True)

    completed = db.Column(db.Boolean, nullable=False, default=False)

    created_at = db.Column(
        db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    @staticmethod
    def generate_code():
        chars = string.ascii_letters + string.digits
        code = ''.join(secrets.choice(chars) for _ in range(12))
        code_exists = Game.query.filter(Game.code == code).first() is not None
        if (code_exists):
            return Game.generate_code()
        else:
            return code

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'board': self.board,
            'whiteCanLong': self.white_can_long,
            'whiteCanShort': self.white_can_short,
            'blackCanLong': self.black_can_long,
            'blackCanShort': self.black_can_short,
            'turn': self.turn,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    @property
    def board(self):
        digits = '0123456789'
        spaces_string = ''
        decompressed_string = ''

        for char in self._board:
            if char in digits:
                spaces_string += char
            else:
                if spaces_string != '':
                    decompressed_string += ('_' * int(spaces_string))
                    spaces_string = ''
                decompressed_string += char

        if spaces_string != '':
            decompressed_string += ('_' * int(spaces_string))

        return [list(decompressed_string[i:i+8]) for i in range(0, 64, 8)]

    @board.setter
    def board(self, matrix):
        result = ''
        period_count = 0

        for row in matrix:
            for char in row:
                if char == '_':
                    period_count += 1
                else:
                    if period_count > 0:
                        result += str(period_count)
                        period_count = 0
                    result += char

        if period_count > 0:
            result += str(period_count)

        self._board = result
