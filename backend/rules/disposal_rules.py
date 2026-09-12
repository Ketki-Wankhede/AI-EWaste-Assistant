DISPOSAL_RULES = {

    "charger": {
        "action": "Send to an authorized e-waste collection or recycling facility.",
        "safety_warning": "Do not throw electronic chargers into regular household waste.",
        "handling": "Keep the charger dry and store it safely until disposal."
    },

    "cable": {
        "action": "Reuse if working, or send it to an authorized e-waste recycler.",
        "safety_warning": "Do not burn or damage the cable.",
        "handling": "Keep cables dry and untangled before disposal."
    },

    "earphones": {
        "action": "Reuse, donate if functional, or send to an authorized e-waste recycler.",
        "safety_warning": "Do not dispose of electronic earphones with regular waste.",
        "handling": "Store them safely until responsible disposal."
    },

    "battery": {
        "action": "Take the battery to an authorized battery or e-waste collection facility.",
        "safety_warning": "Do not put batteries in regular household waste.",
        "handling": "Keep batteries away from heat, water, and physical damage."
    },

    "mobile_accessories": {
        "action": "Reuse or donate if functional, otherwise send to an authorized e-waste recycler.",
        "safety_warning": "Electronic accessories should not be mixed with regular waste.",
        "handling": "Store the item safely until responsible disposal."
    },

    "computer_components": {
        "action": "Reuse, donate, or send the component to an authorized e-waste recycler.",
        "safety_warning": "Do not dismantle electronic components yourself.",
        "handling": "Keep components dry and protected from physical damage."
    }
}


def get_disposal_guidance(category):
    return DISPOSAL_RULES.get(
        category,
        {
            "action": "Please verify the item and contact an authorized e-waste collection facility.",
            "safety_warning": "Identification is uncertain. Do not dispose of the item with regular waste.",
            "handling": "Keep the item safely stored until it can be identified and disposed of responsibly."
        }
    )