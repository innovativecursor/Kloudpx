package auth

var RolePermissions = map[string][]string{
	"admin":      {"manage_all"},
	"supplier":   {"supply_medicine"},
	"user":       {"add_to_cart"},
	"pharmacist": {"approve_prescription", "suggest_alternative"},
}

// Check if a role has permission
func HasPermission(role, permission string) bool {
	for _, perm := range RolePermissions[role] {
		if perm == permission {
			return true
		}
	}
	return false
}