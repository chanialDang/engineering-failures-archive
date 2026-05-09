# TODO: AI->UI control plane (deferred)
#
# Future home for /admin/ui-config — lets the chat agent or an authenticated
# operator push UI configuration (theme, featured list, section toggles) that
# the frontend reads at boot. Intentionally NOT mounted in main.py.
#
# Before mounting:
#   - add auth (token or signed origin)
#   - add an audit log for every write
#   - decide on persistence (Supabase table vs. JSON blob)
#   - bound payload size + validate against an allow-list of fields
