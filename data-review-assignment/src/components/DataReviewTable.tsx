// components/DataReview.tsx

import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip'

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

    const cellFormatter = (record: Record, field: keyof Record) => {
        const errors = record.errors
        if (field in errors) {
            const getBackgroundColor = (severity: string) => {
                if (severity === 'warning') return 'bg-yellow-400 bg-opacity-50';
                if (severity === 'critical') return 'bg-red-500 bg-opacity-90';
                return "";
            }
            const backgroundColor = getBackgroundColor(errors[field].severity);
            const errorMessage = errors[field].message;

            return (
                // <td className={`px-6 py-4 text-gray-800 bg-opacity-50 ${backgroundColor}`}>
                //     {record[field]}
                // </td>
                <td
                    className={`px-6 py-4 text-gray-800 ${backgroundColor}`}
                    data-tip={errorMessage} // Add error message for the tooltip
                >
                    {record[field]}
                    <Tooltip place="top" /> {/* Initialize Tooltip */}
                </td>
            )
        } else {
            return (
                <td className="px-6 py-4 text-gray-800 bg-green-600 bg-opacity-20">
                    {record[field]}
                </td>
            )
        }
    }

    return (
        <div className="mx-auto">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold text-gray-700">Data Display!</h1>
                </div>
                <div className="py-6 flex items-center justify-center">
                    <table className="shadow-md sm:rounded-lg w-2/3 text-sm text-left rtl:text-right text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="border-b-2 border-gray-800">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
