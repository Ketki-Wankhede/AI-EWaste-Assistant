DISPOSAL_RULES = {

    "charger": {
        "action": "If the charger is working, consider reusing or donating it. If damaged or no longer usable, send it to an authorized e-waste recycling facility.",
        "safety_warning": "Do not use chargers with exposed wires, burn marks, cracks, or damaged plugs.",
        "handling": "Keep the charger dry and avoid bending or cutting the cable."
    },

    "cable": {
        "action": "Working cables can be reused or donated. Damaged or unusable cables should be sent to an authorized e-waste recycling facility.",
        "safety_warning": "Do not use cables with exposed wires, melted insulation, or damaged connectors.",
        "handling": "Store cables safely without cutting, burning, or stripping their insulation."
    },

    "earphones": {
        "action": "Working earphones can be reused or donated. Non-working earphones should be sent to an authorized e-waste recycling facility.",
        "safety_warning": "Do not attempt to dismantle earphones containing batteries.",
        "handling": "Keep earphones dry and store them safely until reuse or responsible recycling."
    },

    "battery": {
        "action": "Do not throw batteries into household waste. Take them to an authorized battery or e-waste collection facility.",
        "safety_warning": "Do not puncture, crush, burn, or short-circuit batteries. Damaged or swollen batteries require extra care.",
        "handling": "Store batteries in a cool, dry place and keep terminals protected from contact with metal objects."
    },

    "mobile_accessories": {
        "action": "Working mobile accessories can be reused or donated. Unusable accessories should be taken to an authorized e-waste recycling facility.",
        "safety_warning": "Avoid using accessories that are cracked, burnt, or electrically damaged.",
        "handling": "Store accessories safely and keep them away from moisture."
    },

    "computer_components": {
        "action": "Working computer components may be reused, repaired, or donated. Non-working components should be taken to an authorized e-waste recycling facility.",
        "safety_warning": "Do not dismantle electronic components unless you are trained to do so.",
        "handling": "Handle components carefully and protect them from moisture, dust, and physical damage."
    }
}


def get_disposal_guidance(category):
    return DISPOSAL_RULES.get(
        category,
        {
            "action": "Please verify the item manually and contact an authorized e-waste collection facility.",
            "safety_warning": "The system could not identify the item reliably.",
            "handling": "Keep the item safely stored until it can be identified."
        }
    )
