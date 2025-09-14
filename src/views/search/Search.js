import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CCol,
  CRow,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAccordion,
} from '@coreui/react'

const SearchResults = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const searchTerm = params.get('query') || ''

  const [tableData, setTableData] = useState([])
  const token = localStorage.getItem('token') || ''

  useEffect(() => {
    if (!searchTerm) {
      setTableData([])
      return
    }

    const controller = new AbortController()
    let isMounted = true

    fetch(
      `https://salusback.geareab.com/item/amount/10/name/${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    )
      .then(async (res) => {
        let data
        try {
          data = await res.json()
        } catch {
          data = null
        }

        if (!res.ok) {
          console.error('API Error:', res.status, data)
          return
        }

        // Normalize response to array of items
        if (data && Array.isArray(data.item) && isMounted) {
          setTableData(data.item)
        } else {
          setTableData([])
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Fetch error:', err)
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [searchTerm, token])

  return (
    <CRow>
      <CCol>
        {tableData.length === 0 ? (
          <div>No items found</div>
        ) : (
          <CAccordion flush>
            {tableData.map((obj, index) => {
              const item = obj.item
              return (
                <CAccordionItem key={index}>
                  <CAccordionHeader>
                    <CCol>
                      <CRow className="align-items-center">
                        <CCol>
                          <div className="border-start border-start-4 border-start-success py-1 px-2 mb-1">
                            <div className="fs-9 fw-semibold">{item.name}</div>
                            <div className="text-medium-emphasis small">{item.company_name}</div>
                          </div>
                        </CCol>
                        <CCol xs lg={6}>
                          <div className="border-start border-start-4 border-start-warning py-1 px-2 mb-1">
                            <div className="fs-9 fw-semibold align-middle">{item.location_name}</div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <strong>{item.name}</strong> from <em>{item.company_name}</em> located at{' '}
                    <em>{item.location_name}</em>.
                  </CAccordionBody>
                </CAccordionItem>
              )
            })}
          </CAccordion>
        )}
      </CCol>
    </CRow>
  )
}

export default SearchResults
