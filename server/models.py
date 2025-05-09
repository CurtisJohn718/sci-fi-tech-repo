from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db


# Models go here!
# Universe has many Characters
class Universe(db.Model, SerializerMixin):
    __tablename__ = 'universes'
    __table_args__ = {'extend_existing': True}

    serialize_rules = ('-characters.universe',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    characters = db.relationship("Character", back_populates="universe", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Universe {self.id}, {self.name}>'
    

# Character belongs to Universe
# Character has many Reviews
# Character relates to many Technologies through Reviews
class Character(db.Model, SerializerMixin):
    __tablename__ = 'characters'

    serialize_rules = ('-universe.characters', '-reviews.character', '-technologies.characters')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    universe_id = db.Column(db.Integer, db.ForeignKey('universes.id'))

    universe = db.relationship("Universe", back_populates="characters")
    reviews = db.relationship("Review", back_populates="character", cascade="all, delete-orphan")

    technologies = association_proxy("reviews", "technology")

    def __repr__(self):
        return f'<Character {self.id}, {self.name}, {self.description}>'
    

# Technology has many Reviews
# Technology relates to many Characters through Reviews
class Technology(db.Model, SerializerMixin):
    __tablename__ = 'technologies'

    serialize_rules = ('-reviews.technology', '-characters.technologies')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    reviews = db.relationship("Review", back_populates="technology", cascade="all, delete-orphan")
    characters = association_proxy("reviews", "character")

    def __repr__(self):
        return f'<Technology {self.id}, {self.name}, {self.description}>'
    
# ---Association Table---
# Review is the association table for Character <-> Technology
# Also holds user-submitted fields: comment, rating
class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    serialize_rules = ('-character.reviews', '-technology.reviews', 'character.name', 'technology.name')

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))
    technology_id = db.Column(db.Integer, db.ForeignKey('technologies.id'))

    character = db.relationship("Character", back_populates="reviews")
    technology = db.relationship("Technology", back_populates="reviews")

    def __repr__(self):
        return f'<Review {self.id}, Character:{self.character_id}, Tech:{self.technology_id}, Rating:{self.rating}>'    
