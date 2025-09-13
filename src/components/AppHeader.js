import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CInputGroupText,
  CInputGroup,
  CButton,
  CNavLink,
  CNavItem,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilSearch } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [input, setInput] = useState('')
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const history = useHistory()
  const token = localStorage.getItem('token') || ''
  const dropdownRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    history.push(`/search?query=${encodeURIComponent(input)}`)
    setDropdownVisible(false)
  }

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    let isMounted = true

    const delayDebounceFn = setTimeout(() => {
      fetch(
        `https://salusback.geareab.com/item/amount/10/name/${encodeURIComponent(input)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      )
        .then(async (res) => {
          const data = await res.json().catch(() => null)
          if (!res.ok) {
            console.error('API Error:', res.status, data)
            return
          }
          if (isMounted && data && Array.isArray(data.item)) {
            setSuggestions(data.item)
            setDropdownVisible(true)
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') console.error('Fetch error:', err)
        })
    }, 300) // debounce 300ms

    return () => {
      clearTimeout(delayDebounceFn)
      isMounted = false
      controller.abort()
    }
  }, [input, token])

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

        <CHeaderNav className="flex-fill d-none d-md-block" style={{ position: 'relative' }}>
          <form onSubmit={handleSearch} className="d-flex" ref={dropdownRef}>
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
                aria-label="Search"
                autoComplete="off"
              />
              <CButton type="submit" color="primary">
                Search
              </CButton>
            </CInputGroup>

            {/* Dropdown overlay */}
            {dropdownVisible && suggestions.length > 0 && (
              <CListGroup
                style={{
                  position: 'absolute',
                  top: '100%',
                  zIndex: 1000,
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {suggestions.map((obj, index) => {
                  const item = obj.item
                  return (
                    <CListGroupItem
                      key={index}
                      className="list-group-item-action"
                      onClick={() => {
                        setInput(item.name)
                        setDropdownVisible(false)
                        history.push(`/search?query=${encodeURIComponent(item.name)}`)
                      }}
                    >
                      <strong>{item.name}</strong> - <em>{item.location}</em>
                    </CListGroupItem>
                  )
                })}
              </CListGroup>
            )}
          </form>
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

      <CContainer fluid className="d-md-none" style={{ position: 'relative' }}>
        <CHeaderNav className="col-12" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="d-flex">
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
                aria-label="Search"
                autoComplete="off"
              />
              <CButton type="submit" color="primary">
                Search
              </CButton>
            </CInputGroup>

            {/* Dropdown overlay for mobile */}
            {dropdownVisible && suggestions.length > 0 && (
              <CListGroup
                style={{
                  position: 'absolute',
                  top: '100%',
                  zIndex: 1000,
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {suggestions.map((obj, index) => {
                  const item = obj.item
                  return (
                    <CListGroupItem
                      key={index}
                      className="list-group-item-action"
                      onClick={() => {
                        setInput(item.name)
                        setDropdownVisible(false)
                        history.push(`/search?query=${encodeURIComponent(item.name)}`)
                      }}
                    >
                      <strong>{item.name}</strong> - <em>{item.location}</em>
                    </CListGroupItem>
                  )
                })}
              </CListGroup>
            )}
          </form>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
