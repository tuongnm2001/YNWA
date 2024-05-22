import React, { useState } from 'react';
import { Button, Drawer } from 'antd';

const FilterMobile = (props) => {

    const { open, setOpen, renderContentLeft } = props;

    return (
        <Drawer title="Basic Drawer"
            onClose={() => setOpen(false)}
            open={open}
        >
            {renderContentLeft}
        </Drawer>
    );
}

export default FilterMobile;