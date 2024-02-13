/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentList from '@components/user/AppointmentListForm';
import { User } from "@prisma/client";
import { getUserAppointmentsDate } from '@app/actions';

describe('AppointmentList', () => {
    const user1: User = {
        id: 1,
        username: "user1",
        password: "password",
        email: "user1@example.com",
        firstname: "User",
        lastname: "One",
        role: "PROFESSIONAL",
    };
    const user2: User = {
        id: 2,
        username: "johndoe",
        password: "password",
        email: "johndoe@example.com",
        firstname: "John",
        lastname: "Doe",
        role: "CLIENT",
    };


    it('renders component with initial state', async () => {
        render(<AppointmentList user={user1} />);

        expect(screen.getByText('Appointments')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('No appointments available.')).toBeInTheDocument();
        });
    });

    it('renders appointments when data is available', async () => {
        const appointment = [
            { proUsrName: '', clientUsrName: 'John Doe', time: new Date('2024-02-11') },
        ];
        getUserAppointmentsDate.mockImplementationOnce(() => Promise.resolve(mockAppointments));
 
        render(<AppointmentList user={user1} />);

        // Wait for the useEffect to fetch data and render the component
        await waitFor(() => {
            expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('2024-02-11')).toBeInTheDocument();
        });
    });
});
