import {
  CCol,
  CRow,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAccordion,
} from '@coreui/react'

const Dashboard = () => {
  const tableExample = [
    {
      "item": {
        "_id": "61e07db2ab62131781dc4297",
        "name": "BRUPSIN D TAB",
        "location": "N/Anmnbmn nhbjnb",
        "company": "ACCUMENTUS"
      }
    },
    {
      "item": {
        "_id": "61e07db1ab62131781dbff76",
        "name": "BROMHEXINE TAB",
        "location": "IPCA 4",
        "company": "IPCA/S.R.N"
      }
    },
    {
      "item": {
        "_id": "61e07db1ab62131781dc06b0",
        "name": "BRENTOR -800 MG TAB",
        "location": "BOX 31",
        "company": "ZEE LAB/SOMA PHARMA"
      }
    },
    {
      "item": {
        "_id": "61e07db1ab62131781dc0c4e",
        "name": "BRUGEL GEL",
        "location": "B DE CREAM VITCH",
        "company": "ABBOT /DEEP"
      }
    },
    {
      "item": {
        "_id": "61e07db1ab62131781dc0feb",
        "name": "BRACKEN CAP",
        "location": "LEE FORD 1",
        "company": "LEEFORD/GURDAS"
      }
    }
  ]

  return (
    <>
      <CRow>
        <CCol>
          <CAccordion flush>
            {tableExample.map((item, index) => (
              <CAccordionItem key={index}>
                <CAccordionHeader>
                  <CCol>
                    <CRow className="align-items-center">
                      <CCol>
                        <div className="border-start border-start-4 border-start-success py-1 px-2 mb-1">
                          <div className="fs-9 fw-semibold">{item.item.name}</div>
                          <div className="text-medium-emphasis small">{item.item.company}</div>
                        </div>
                      </CCol>
                      <CCol xs lg={6} >
                        <div className="border-start border-start-4 border-start-warning py-1 px-2 mb-1">
                          <div className="fs-9 fw-semibold align-middle">{item.item.location}</div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>

                </CAccordionHeader>
                <CAccordionBody>
                  <strong>This is the first item's accordion body.</strong> It is hidden by default,
                  until the collapse plugin adds the appropriate classes that we use to style each
                  element. These classes control the overall appearance, as well as the showing and
                  hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                  our default variables. It's also worth noting that just about any HTML can go within
                  the <code>.accordion-body</code>, though the transition does limit overflow.
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
