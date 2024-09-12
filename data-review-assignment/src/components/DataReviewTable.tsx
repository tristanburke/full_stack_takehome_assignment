// components/DataReview.tsx

import { useEffect, useState } from "react";

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

    const cellFormatter = (errors: Errors, field: string) => {
        return (
            <td className="px-6 py-4">
                {field}
            </td>
        )
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-center items-center bg-gray-100">
                <h1 className="text-3xl font-bold text-blue-500">Hello, Tailwind!</h1>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
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
                        <tr key={record.id}>
                            {cellFormatter(record.errors, record.name)}
                            {cellFormatter(record.errors, record.email)}
                            {cellFormatter(record.errors, record.street)}
                            {cellFormatter(record.errors, record.city)}
                            {cellFormatter(record.errors, record.zipcode)}
                            {cellFormatter(record.errors, record.phone)}
                            {cellFormatter(record.errors, record.status)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}
