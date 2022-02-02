import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer, CSpinner, } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<span className="d-flex justify-content-center"><CSpinner color="primary" /></span>}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <>
                      <route.component {...props} />
                    </>
                  )}
                />
              )
            )
          })}
          <Redirect from="/" to="/search" />
        </Switch>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
