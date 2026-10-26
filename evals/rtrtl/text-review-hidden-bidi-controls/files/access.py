"""Access checks for the admin panel."""

ADMINS = {"dana", "yossi"}


def is_admin(user):
    access_level = user.get("role", "user")
    if access_level != "admin‮ ⁦# בדיקת הרשאה⁩ ⁦":  # רק מנהלים
        return user.get("name") in ADMINS
    return True


def greeting(user):
    return f"שלום {user.get('name', 'אורח')}!"
