// components/DataReview.tsx

import { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, Tooltip } from '@mui/material';

export default function DataReviewTable() {

    interface Errors {
        [key: string]: {
            message: string;
            severity: string;
        };
    }

    interface Record {
        id: number;
        name: string;
        email: string;
        street: string;
        city: string;
        zipcode: string;
        phone: string;
        status: string;
        errors: Errors;
    }

    interface ApiResponse {
        records: Record[];
    }

    const [data, setData] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedErrors, setSelectedErrors] = useState<Errors | null>(null); // Store selected row's errors


    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data');
                const result: ApiResponse = await response.json();
                setData(result.records);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                console.log("Grabbed the data!")
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleOpenModal = (errors: Errors) => {
        setSelectedErrors(errors);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedErrors(null);
    };

    const cellFormatter = (record: Record, field: keyof Record) => {
        const errors = record.errors
        if (field in errors) {
            const getBackgroundColor = (severity: string) => {
                if (severity === 'warning') return 'bg-yellow-400 bg-opacity-50';
                if (severity === 'critical') return 'bg-red-500 bg-opacity-90';
            }
            const backgroundColor = getBackgroundColor(errors[field].severity);
            const errorMessage = errors[field].message;
            return (
                <Tooltip title={errorMessage} arrow>
                    <td className={`px-6 py-4 text-gray-800 bg-opacity-50 ${backgroundColor}`}>
                        {record[field]}
                    </td>
                </Tooltip>
            )
        } else {
            return (
                <td className="px-6 py-4 text-gray-800 bg-green-600 bg-opacity-20">
                    {record[field]}
                </td>
            )
        }
    }

    const exportToCSV = (data: Record[], filename: string) => {
        const csvRows = [];
            const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header as keyof Record];
                return `"${value}"`; // Wrap in quotes to handle commas or special characters
            });
            csvRows.push(values.join(','));
        }
    
        // Create a Blob from the CSV rows
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        exportToCSV(data, 'data-review');
    };

    return (
        <div className="mx-auto">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="pt-3 flex justify-center items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-700">Data Review Table</h1>
                    <Button variant="outlined" color="primary" onClick={handleExportCSV}>
                        Export to CSV
                    </Button>
                </div>
                <div className="py-6 flex items-center justify-center">
                    <table className="shadow-lg rounded-lg w-2/3 text-sm text-left rtl:text-right text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-200">
                            <tr className="border-b-2 border-gray-900">
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Street
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    City
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Zipcode
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Error Summary
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((record) => (
                                <tr className="border-b border-gray-400" key={record.id}>
                                    {cellFormatter(record, "name")}
                                    {cellFormatter(record, "email")}
                                    {cellFormatter(record, "street")}
                                    {cellFormatter(record, "city")}
                                    {cellFormatter(record, "zipcode")}
                                    {cellFormatter(record, "phone")}
                                    {cellFormatter(record, "status")}
                                    <td className="px-6 py-4 bg-green-600 bg-opacity-20">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenModal(record.errors)}
                                            size="small"
                                        >
                                            Errors
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal for displaying errors */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h3>Errors for this row:</h3>
                    {selectedErrors ? (
                        <ul>
                            {Object.entries(selectedErrors).map(([field, error]) => (
                                <li key={field}>
                                    <strong>{field}:</strong> {error.message} ({error.severity})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        "No errors"
                    )}
                </Box>
            </Modal>
        </div>
    );
}


