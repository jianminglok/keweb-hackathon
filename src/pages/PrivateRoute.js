import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from './../hooks/UserContext';
import Loading from './../components/Loading';
import useFindUser from '../hooks/useFindUser';

export default function PrivateRoute(props) {

    const { user, isLoading } = useFindUser();
    const { component: Component, ...rest } = props;

    if (isLoading) {
        return <Loading />
    }

    //redirect if there is no user 
    return user ? <Outlet /> : <Navigate to='/login' />
}