from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Game

game_routes = Blueprint('games', __name__)


@game_routes.route('/')
def games():
    games = Game.query.all()
    return {'games': [game.to_dict() for game in games]}


@game_routes.route('/<int:id>')
def game(id):
    game = Game.query.get(id)
    return game.to_dict()
