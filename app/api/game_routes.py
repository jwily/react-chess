from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.forms import DummyForm
from app.models import db, Game

game_routes = Blueprint('games', __name__)


@game_routes.route('/<code>')
def get_game(code):
    game = Game.query.filter(Game.code == code).first()
    if not game:
        return {'error': 'Match not found.'}, 404
    return game.to_dict()


@game_routes.route('/<code>', methods=['PUT'])
def update_game(code):
    form = DummyForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        game = Game.query.filter(Game.code == code).first()
        data = request.json
        game.board = data['board']
        game.turn = data['turn']
        game.white_can_long = data['whiteCanLong']
        game.white_can_short = data['whiteCanShort']
        game.black_can_long = data['blackCanLong']
        game.black_can_short = data['blackCanShort']
        game.en_passant = data['enPassant']
        db.session.add(game)
        db.session.commit()
        return game.to_dict()


@game_routes.route('/', methods=['POST'])
def new_game():
    form = DummyForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        game = Game(code=Game.generate_code())
        db.session.add(game)
        db.session.commit()
        return game.to_dict()
    return {'error': 'An error has occurred.'}, 401
