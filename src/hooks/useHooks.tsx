import lodash from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import qs from 'qs'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useStore } from '../services/index.ts'
import { get } from 'lodash'

const useHooks = () => {
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const location = useLocation()
    const params = useParams()
    const query: any = qs.parse(location.search, { ignoreQueryPrefix: true })
    const navigate = useNavigate()
    const { user } = useStore()

    const organizationId = query.organization_id ||
        get(user, "data.organization_id") ||
        get(user, "data.organization.id") ||
        get(user, "data.balances[0].organization_id");

    return {
        query,
        location,
        params,
        t,
        navigate,
        qs,
        queryClient,
        organizationId,
        ...lodash,
    }
}

export default useHooks
