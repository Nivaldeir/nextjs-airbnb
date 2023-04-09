"use client";
import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/navbar/Heading";
import { SafeReservations, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface TripsClientProps {
    reservations: SafeReservations[];
    currentUser: SafeUser | null;
}
const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser,
}) => {
    const router = useRouter();
    const [deleteingId, setDeleteingId] = useState("");

    const onCancel = useCallback(
        (id: string) => {
            setDeleteingId(id);
            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.success("Reservation cancelled");
                    router.refresh();
                })
                .catch((err) => toast.error(err?.response?.data?.error))
                .finally(() => setDeleteingId(""));
        },
        [router]
    );

    return (
        <Container>
            <Heading
                title={"Trips"}
                subtitle={"Where youve been and where youre"}
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation) => {
                    return (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservations={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={deleteingId === reservation.id}
                            currentUser={currentUser}
                            actionLabel="cancel reservation"
                        />
                    );
                })}
            </div>
        </Container>
    );
};

export default TripsClient;
