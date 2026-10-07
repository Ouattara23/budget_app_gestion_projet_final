import AuthProviderFirebase from '@/components/AuthProviderFireBase'
import React from 'react'

function layout({children}: { children: React.ReactNode}) {
  return (
    <AuthProviderFirebase>
        {children}
    </AuthProviderFirebase>
  )
}

export default layout
