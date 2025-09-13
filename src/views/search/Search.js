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
    if (!searchTerm) return
    let isMounted = true
    const controller = new AbortController()

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
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          console.error('API Error:', res.status, errData)
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data && isMounted) setTableData(data)
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
        <CAccordion flush>
          {tableData.length === 0 ? (
            <div>No items found</div>
          ) : (
            tableData.map((itemObj, index) => {
              const item = itemObj.item || itemObj
              return (
                <CAccordionItem key={index}>
                  <CAccordionHeader>
                    <CCol>
                      <CRow className="align-items-center">
                        <CCol>
                          <div className="border-start border-start-4 border-start-success py-1 px-2 mb-1">
                            <div className="fs-9 fw-semibold">{item.name}</div>
                            <div className="text-medium-emphasis small">{item.company}</div>
                          </div>
                        </CCol>
                        <CCol xs lg={6}>
                          <div className="border-start border-start-4 border-start-warning py-1 px-2 mb-1">
                            <div className="fs-9 fw-semibold align-middle">{item.location}</div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <strong>{item.name}</strong> from <em>{item.company}</em> located at{' '}
                    <em>{item.location}</em>.
                  </CAccordionBody>
                </CAccordionItem>
              )
            })
          )}
        </CAccordion>
      </CCol>
    </CRow>
  )
}

export default SearchResults
