import React, { useState } from 'react'
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
  const [input, setInput] = useState('');

  console.log(input)


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
        <CHeaderNav className=" flex-fill d-none d-md-block">
          <CInputGroup className="flex-nowrap" size="lg">
            <CInputGroupText id="addon-wrapping"><CIcon icon={cilSearch} height={19} /></CInputGroupText>
            <input className="form-control" type="search" placeholder="Search..." onChange={e => setInput(e.target.value)} aria-label="default input example" />
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
          <CInputGroup className="flex-nowrap" >
            <CInputGroupText id="addon-wrapping"><CIcon icon={cilSearch} height={18} /></CInputGroupText>
            <input className="form-control" type="search" placeholder="Search..." onChange={e => setInput(e.target.value)} aria-label="default input example" />
          </CInputGroup>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
