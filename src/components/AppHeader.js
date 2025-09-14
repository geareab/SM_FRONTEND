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
  const [loading, setLoading] = useState(false)

  const history = useHistory()
  const token = localStorage.getItem('token') || ''

  const dropdownRef = useRef(null)
  const mobileDropdownRef = useRef(null)
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    history.push(`/search?query=${encodeURIComponent(input)}`)
    setDropdownVisible(false)
  }

  const handleSuggestionClick = (itemName) => {
    setInput(itemName)
    setDropdownVisible(false)
    history.push(`/search?query=${encodeURIComponent(itemName)}`)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (e.target.value.trim().length > 3) {
      setDropdownVisible(true)
    } else {
      setDropdownVisible(false)
      setSuggestions([])
    }
  }

  // Fetch suggestions with debouncing when input length > 3
  useEffect(() => {
    if (input.trim().length <= 3) {
      setSuggestions([])
      setDropdownVisible(false)
      return
    }

    const controller = new AbortController()
    let isMounted = true

    const delayDebounceFn = setTimeout(() => {
      setLoading(true)
      fetch(
        `https://salusback.geareab.com/item/amount/5/name/${encodeURIComponent(input)}`,
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
            setDropdownVisible(data.item.length > 0)
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Fetch error:', err)
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
      isMounted = false
      controller.abort()
      setLoading(false)
    }
  }, [input, token])

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) &&
        (inputRef.current && !inputRef.current.contains(event.target)) &&
        (mobileInputRef.current && !mobileInputRef.current.contains(event.target))
      ) {
        setDropdownVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setDropdownVisible(false)
  }

  const getDropdownStyle = () => {
    const activeInput = inputRef.current || mobileInputRef.current
    if (!activeInput) {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 300,
        zIndex: 9999,
        maxHeight: '300px',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '0.375rem',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.175)',
      }
    }

    const rect = activeInput.getBoundingClientRect()
    return {
      position: 'fixed',
      top: rect.bottom + window.scrollY,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '0.375rem',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.175)',
    }
  }

  return (
    <>
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

          {/* Desktop Search */}
          <CHeaderNav className="flex-fill d-none d-md-block">
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <form onSubmit={handleSearch} className="d-flex">
                <CInputGroup className="flex-nowrap" size="lg">
                  <CInputGroupText>
                    <CIcon icon={cilSearch} height={19} />
                  </CInputGroupText>
                  <input
                    ref={inputRef}
                    className="form-control"
                    type="search"
                    placeholder="Search..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    aria-label="Search"
                    autoComplete="off"
                  />
                  <CButton type="submit" color="primary">
                    Search
                  </CButton>
                </CInputGroup>
              </form>
            </div>
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

        {/* Mobile Search */}
        <CContainer fluid className="d-md-none">
          <div style={{ position: 'relative' }} ref={mobileDropdownRef}>
            <CHeaderNav className="col-12">
              <form onSubmit={handleSearch} className="d-flex w-100">
                <CInputGroup className="flex-nowrap">
                  <CInputGroupText>
                    <CIcon icon={cilSearch} height={18} />
                  </CInputGroupText>
                  <input
                    ref={mobileInputRef}
                    className="form-control"
                    type="search"
                    placeholder="Search..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    aria-label="Search"
                    autoComplete="off"
                  />
                  <CButton type="submit" color="primary">
                    Search
                  </CButton>
                </CInputGroup>
              </form>
            </CHeaderNav>
          </div>
        </CContainer>
      </CHeader>

      {/* Dropdown Portal */}
      {dropdownVisible && (suggestions.length > 0 || loading) && (
        <div style={getDropdownStyle()}>
          {loading && (
            <div className="p-3 text-center">
              <small>Loading...</small>
            </div>
          )}
          {!loading && suggestions.length === 0 && input.trim().length > 3 && (
            <div className="p-3 text-center text-muted">
              <small>No results found</small>
            </div>
          )}
          {!loading &&
            suggestions.map((obj, index) => {
              const item = obj.item
              return (
                <div
                  key={`${item.name}-${index}`}
                  className="p-3 border-bottom"
                  onClick={() => handleSuggestionClick(item.name)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f8f9fa')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                >
                  <strong>{item.name}</strong>
                  {item.location && (
                    <span className="text-muted ms-2">
                      <em>{item.location}</em>
                    </span>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </>
  )
}

export default AppHeader
