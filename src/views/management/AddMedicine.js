import React, { useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CAlert,
    CSpinner
} from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AddMedicine = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        location: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [companies, setCompanies] = useState([])
    const [locations, setLocations] = useState([])
    const [companySearch, setCompanySearch] = useState('')
    const [locationSearch, setLocationSearch] = useState('')
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const [filteredCompanies, setFilteredCompanies] = useState([])
    const [filteredLocations, setFilteredLocations] = useState([])

    // Fetch companies and locations on component mount
    React.useEffect(() => {
        fetchCompanies()
        fetchLocations()
    }, [])

    // Filter companies and locations based on search
    React.useEffect(() => {
        setFilteredCompanies(
            companies.filter(company =>
                company && company.toLowerCase().includes(companySearch.toLowerCase())
            )
        )
    }, [companies, companySearch])

    React.useEffect(() => {
        setFilteredLocations(
            locations.filter(location =>
                location && location.toLowerCase().includes(locationSearch.toLowerCase())
            )
        )
    }, [locations, locationSearch])

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.position-relative')) {
                setShowCompanyDropdown(false)
                setShowLocationDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://salusback.geareab.com/company', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json()
                setCompanies(data.company || [])
            }
        } catch (error) {
            console.error('Error fetching companies:', error)
        }
    }

    const fetchLocations = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://salusback.geareab.com/location', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json()
                setLocations(data.location || [])
            }
        } catch (error) {
            console.error('Error fetching locations:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCompanySearch = (e) => {
        const value = e.target.value
        setCompanySearch(value)
        setFormData(prev => ({ ...prev, company: value }))
        setShowCompanyDropdown(value.length > 0)
    }

    const handleLocationSearch = (e) => {
        const value = e.target.value
        setLocationSearch(value)
        setFormData(prev => ({ ...prev, location: value }))
        setShowLocationDropdown(value.length > 0)
    }

    const selectCompany = (company) => {
        setFormData(prev => ({ ...prev, company }))
        setCompanySearch(company)
        setShowCompanyDropdown(false)
    }

    const selectLocation = (location) => {
        setFormData(prev => ({ ...prev, location }))
        setLocationSearch(location)
        setShowLocationDropdown(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://salusback.geareab.com/item', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                await response.json()
                setMessage({ type: 'success', text: 'Medicine added successfully!' })
                setFormData({ name: '', company: '', location: '' })
                setCompanySearch('')
                setLocationSearch('')
                setShowCompanyDropdown(false)
                setShowLocationDropdown(false)
                // Refresh the lists
                fetchCompanies()
                fetchLocations()
            } else {
                const errorData = await response.json()
                setMessage({ type: 'danger', text: errorData.message || 'Failed to add medicine' })
            }
        } catch (error) {
            console.error('Error adding medicine:', error)
            setMessage({ type: 'danger', text: 'Network error. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Add New Medicine</strong>
                    </CCardHeader>
                    <CCardBody>
                        {message.text && (
                            <CAlert color={message.type} className="mb-3">
                                {message.text}
                            </CAlert>
                        )}

                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="name">Medicine Name *</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter medicine name"
                                        required
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="company">Company *</CFormLabel>
                                    <div className="position-relative">
                                        <CFormInput
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={companySearch}
                                            onChange={handleCompanySearch}
                                            placeholder="Search or type new company"
                                            required
                                            autoComplete="off"
                                        />
                                        {showCompanyDropdown && filteredCompanies.length > 0 && (
                                            <div className="position-absolute w-100" style={{ zIndex: 1000, backgroundColor: 'white', border: '1px solid #ced4da', borderTop: 'none', maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredCompanies.map((company, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 border-bottom"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => selectCompany(company)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                    >
                                                        {company}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="location">Location *</CFormLabel>
                                    <div className="position-relative">
                                        <CFormInput
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={locationSearch}
                                            onChange={handleLocationSearch}
                                            placeholder="Search or type new location"
                                            required
                                            autoComplete="off"
                                        />
                                        {showLocationDropdown && filteredLocations.length > 0 && (
                                            <div className="position-absolute w-100" style={{ zIndex: 1000, backgroundColor: 'white', border: '1px solid #ced4da', borderTop: 'none', maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredLocations.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 border-bottom"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => selectLocation(location)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                    >
                                                        {location}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol>
                                    <CButton
                                        type="submit"
                                        color="primary"
                                        disabled={loading}
                                        className="me-2"
                                    >
                                        {loading ? (
                                            <>
                                                <CSpinner size="sm" className="me-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <CIcon icon={cilPlus} className="me-2" />
                                                Add Medicine
                                            </>
                                        )}
                                    </CButton>
                                    <CButton
                                        type="button"
                                        color="secondary"
                                        onClick={() => {
                                            setFormData({ name: '', company: '', location: '' })
                                            setCompanySearch('')
                                            setLocationSearch('')
                                            setShowCompanyDropdown(false)
                                            setShowLocationDropdown(false)
                                        }}
                                    >
                                        Clear Form
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default AddMedicine
