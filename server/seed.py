#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Universe, Character, Technology, Review

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Clearing db...")
        # Seed code goes here!

        # Clear old data
        Review.query.delete()
        Character.query.delete()
        Technology.query.delete()
        Universe.query.delete()

        print("Seeding data...")
        # Universes
        dc = Universe(name="DC Comics")
        marvel = Universe(name="Marvel Comics")
        sw = Universe(name="Star Wars")
        hp = Universe(name="Harry Potter")
        db.session.add_all([dc, marvel, sw, hp])
        db.session.commit()

        # Characters
        characters = [
            Character(name="Batman", description="Dark Knight of Gotham", universe=dc),
            Character(name="Iron Man", description="Genius billionaire inventor", universe=marvel),
            Character(name="Darth Vader", description="Sith Lord", universe=sw),
            Character(name="Harry Potter", description="The Boy Who Lived", universe=hp),
        ]
        db.session.add_all(characters)
        db.session.commit()
            

        # Technologies
        technologies = [
            Technology(name="Batarang", function="Throwing weapon"),
            Technology(name="Arc Reactor", function="Power supply"),
            Technology(name="Lightsaber", function="Plasma blade weapon"),
            Technology(name="Invisibility Cloak", function="Hides the wearer"),
        ]
        db.session.add_all(technologies)
        db.session.commit()

        # Reviews (connecting characters to tech)
        reviews = [
            Review(comment="Classic but effective", rating=4, character=characters[0], technology=technologies[0]),
            Review(comment="Revolutionary tech!", rating=5, character=characters[1],  technology=technologies[1]),
            Review(comment="Iconic weapon of the Jedi", rating=5, character=characters[2], technology=technologies[2]),
            Review(comment="Very useful in sneaky missions", rating=4, character=characters[3], technology=technologies[3]),
        ]
        db.session.add_all(reviews)
        db.session.commit()

        print("Done seeding!")