
import { useStore } from "../services";
import { get } from "lodash";


const useAccess = (slug: string = '') => {
  const { user } = useStore();

  // Foydalanuvchiga biriktirilgan permissions (slugs)
  const allPermissions = get(user, "data.permissions", [])

  // slug dot-notation bo'lishi mumkin: 'organizations.branches' yoki 'branches'
  // 'organizations.branches' → birinchi 'organizations.branches.list' tekshiradi
  // Fallback: agar namespace'd bo'lsa, oxirgi qism bilan ham tekshiriladi: 'branches.list'
  const parts = slug.split('.')
  const basePart = parts[parts.length - 1]

  const included = (action: string) => {
    // 1. To'liq namespace: 'organizations.branches.list'
    if (allPermissions.includes(`${slug}.${action}`)) return true;
    // 2. Fallback: 'branches.list' (faqat namespace'd sluglar uchun)
    if (parts.length > 1 && allPermissions.includes(`${basePart}.${action}`)) return true;
    return false;
  };

  return {
    permissions: allPermissions,
    isCreate: included('create') || included('add'),
    isDelete: included('delete'),
    isUpdate: included('update') || included('edit'),
    isList: included('list'),
    isView: included('view') || included('get') || included('show')
  };
}

export default useAccess;
