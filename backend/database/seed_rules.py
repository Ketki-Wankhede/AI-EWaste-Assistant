from backend.database.database import SessionLocal
from backend.database.models import DisposalRule
from backend.rules.disposal_rules import DISPOSAL_RULES


def seed_disposal_rules():
    db = SessionLocal()

    try:
        for category, rule in DISPOSAL_RULES.items():

            existing_rule = (
                db.query(DisposalRule)
                .filter(DisposalRule.category == category)
                .first()
            )

            if existing_rule:
                continue

            new_rule = DisposalRule(
                category=category,
                action=rule["action"],
                safety_warning=rule["safety_warning"],
                handling_instruction=rule["handling"]
            )

            db.add(new_rule)

        db.commit()
        print("Disposal rules added successfully!")

    except Exception as e:
        db.rollback()
        print("Failed to add disposal rules!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_disposal_rules()