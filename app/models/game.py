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
        db.String(255), nullable=False, default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')

    white_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))
    black_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))

    turn = db.Column(db.String(5), nullable=False, default='white')

    white_can_long = db.Column(db.Boolean, nullable=False, default=True)
    white_can_short = db.Column(db.Boolean, nullable=False, default=True)
    black_can_long = db.Column(db.Boolean, nullable=False, default=True)
    black_can_short = db.Column(db.Boolean, nullable=False, default=True)

    en_passant = db.Column(db.String(2), nullable=False, default='')

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
            'enPassant': self.en_passant,
            'turn': self.turn,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    @property
    def board(self):

        def decompress_row(string):
            digits = '0123456789'
            decompressed = []
            for char in string:
                if not char in digits:
                    decompressed.append(char)
                else:
                    for i in range(int(char)):
                        decompressed.append('_')
            return decompressed

        rows = self._board.split('/')
        return [decompress_row(row) for row in rows]

    @board.setter
    def board(self, matrix):

        def compress_row(row):
            space_count = 0
            compressed = ''
            for char in row:
                if char != '_':
                    if space_count:
                        compressed += str(space_count)
                        space_count = 0
                    compressed += char
                else:
                    space_count += 1
            if space_count:
                compressed += str(space_count)
            return compressed

        self._board = '/'.join([compress_row(row) for row in matrix])
