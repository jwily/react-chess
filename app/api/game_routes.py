from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.forms import DummyForm
from app.models import db, Game

game_routes = Blueprint('games', __name__)


@game_routes.route('/')
def games():
    games = Game.query.all()
    return {'games': [game.to_dict() for game in games]}


@game_routes.route('/<int:id>')
def game(id):
    game = Game.query.get(id)
    return game.to_dict()

@game_routes.route('/new', methods=['POST'])
def new_game():
    form = DummyForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        game = Game(code=Game.generate_code())
        db.session.add(game)
        db.session.commit()
        return game.to_dict()
    return {'error': 'An error has occurred.'}, 401
