#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Universe, Character, Technology, Review 

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


# GET, POST, DELETE /universes
class Universes(Resource):
    def get(self):
        universes = Universe.query.all()
        return [u.to_dict() for u in universes], 200
    
    def post(self):
        data = request.get_json()
        name = data.get("name")
        if not name:
            return {"error": "Name is required."}, 400
        new_universe = Universe(name=name)
        db.session.add(new_universe)
        db.session.commit()
        return new_universe.to_dict(), 201
       
    def delete(self, id):
        universe = Universe.query.get(id)
        if not universe:
            return {"error": "Universe not found"}, 404
        db.session.delete(universe)
        db.session.commit()
        return {"error": "Universe deleted"}, 204
    

# GET & POST /characters
class Characters(Resource):
    def get(self):
        characters = Character.query.all()
        return [c.to_dict() for c in characters], 200
    
    def post(self):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        universe_id = data.get("universe_id")

        if not all([name, universe_id]):
            return {"error": "Name and universe_id are required."}, 400
        
        if not Universe.query.get(universe_id):
            return {"error": "Universe not found."}, 404
        
        new_character = Character(name=name, description=description, universe_id=universe_id)
        db.session.add(new_character)
        db.session.commit()
        return new_character.to_dict(), 201
        
    
# GET & POST /technologies
class Technologies(Resource):
    def get(self):
        technologies = Technology.query.all()
        return [t.to_dict() for t in technologies], 200
    
    def post(self):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        if not name:
            return {"error": "Name is required."}, 400
        new_tech = Technology(name=name, description=description)
        db.session.add(new_tech)
        db.session.commit()
        return new_tech.to_dict(), 201
    

# GET, POST, PATCH, DELETE /reviews
class Reviews(Resource):
    def get(self):
        reviews = Review.query.all()
        return [r.to_dict() for r in reviews], 200
    
    def post(self):
        data = request.get_json()

        try:
            comment = data['comment']
            rating = int(data['rating'])
            character_id = int(data['character_id'])
            technology_id = int(data['technology_id'])
        except (KeyError, ValueError):
            return {'error': 'Missing or invalid fields.'}, 400
        
        # Optiionally ensure IDs exist
        if not Character.query.get(character_id):
            return {'error': 'Character not found.'}, 404
        if not Technology.query.get(technology_id):
            return {'error': 'Technology not found.'}, 404
        
        new_review = Review(
            comment=comment,
            rating=rating,
            character_id=character_id,
            technology_id=technology_id
        )

        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict(), 201
    
    def delete(self, id):
        review = Review.query.get(id)
        
        if not review:
            return {'error': 'Review not found'}, 404
        
        db.session.delete(review)
        db.session.commit()
        return {}, 204
    
    def patch(self, id):
        review = Review.query.get(id)

        if not review:
            return {"error": "Review not found"}, 404
        
        data = request.get_json()

        try:
            if "comment" in data:
                review.comment = data["comment"]
            if "rating" in data:
                review.rating = int(data["rating"])
        except ValueError:
            return {'error"': 'Invalid data type for rating'}, 400
        
        db.session.commit()
        return review.to_dict(), 200
    
    
# Register resources API endpoints
api.add_resource(Universes, '/universes', '/universes/<int:id>')
api.add_resource(Characters, '/characters')
api.add_resource(Technologies, '/technologies')
api.add_resource(Reviews, '/reviews', '/reviews/<int:id>') # GET/POST/DELETE/PATCH


# Run server
if __name__ == '__main__':
    app.run(port=5555, debug=True)

