/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

const Navigation = () => {

    return (

        <div className="grid-x ">
            <div className="cell small-12 medium-10 large-6" style={{ padding: '7px', margin: '0 auto' }}>

                <div style={{ padding: '7px', float: 'left' }}>
                    <img src="/logo.png" width="150" alt="" />
                </div>

                <button type="button" style={{ marginRight: '12px', float: 'right', position: 'relative', top: '12px' }} ><GiHamburgerMenu style={{ fontSize: '1.5em', color: '#A55640' }} /></button>

            </div>
        </div >

    )
}

export default Navigation

