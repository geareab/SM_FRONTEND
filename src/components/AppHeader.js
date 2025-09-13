import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CInputGroupText,
  CInputGroup,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilSearch } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [input, setInput] = useState('')

  // Get your auth token from localStorage, Redux, or props
  const token = localStorage.getItem('token') || '' // <-- replace if needed

  useEffect(() => {
    if (!input) return

    const delayDebounceFn = setTimeout(() => {
      fetch(
        `https://salusback.geareab.com/item/amount/10/name/${encodeURIComponent(input)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // change header if API expects x-auth-token
          },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            console.error('API Error:', res.status, errorData)
            return
          }
          return res.json()
        })
        .then((data) => {
          if (data) console.log('Search API response:', data)
        })
        .catch((err) => console.error('Fetch error:', err))
    }, 500) // debounce 500ms

    return () => clearTimeout(delayDebounceFn)
  }, [input, token])

  return (
    <CHeader position="sticky" className="mb-4 shadow-sm">
      <CContainer fluid className="d-flex">
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="xxl" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="flex-fill d-none d-md-block">
          <CInputGroup className="flex-nowrap" size="lg">
            <CInputGroupText id="addon-wrapping">
              <CIcon icon={cilSearch} height={19} />
            </CInputGroupText>
            <input
              className="form-control"
              type="search"
              placeholder="Search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="default input example"
            />
          </CInputGroup>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider className="d-md-none" />
      <CContainer fluid className="d-md-none">
        <CHeaderNav className="col-12">
          <CInputGroup className="flex-nowrap">
            <CInputGroupText id="addon-wrapping">
              <CIcon icon={cilSearch} height={18} />
            </CInputGroupText>
            <input
              className="form-control"
              type="search"
              placeholder="Search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="default input example"
            />
          </CInputGroup>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
