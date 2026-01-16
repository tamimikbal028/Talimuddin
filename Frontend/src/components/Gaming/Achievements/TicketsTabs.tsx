import React from "react";
import type { WinningTicket, Restaurant } from "../data/achievementsData";

interface TicketsTabsProps {
  activeTab: "available" | "used";
  setActiveTab: (tab: "available" | "used") => void;
  availableTickets: WinningTicket[];
  usedTickets: WinningTicket[];
  restaurants: Restaurant[];
  onUseTicket: (ticketId: string) => void;
}

const TicketsTabs: React.FC<TicketsTabsProps> = ({
  activeTab,
  setActiveTab,
  availableTickets,
  usedTickets,
  restaurants,
  onUseTicket,
}) => {
  return (
    <div className="rounded-lg bg-white p-3 shadow-md">
      <div className="mb-3 flex gap-5 border-b">
        <button
          onClick={() => setActiveTab("available")}
          className={`pb-3 text-lg font-semibold transition-colors ${
            activeTab === "available"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Available Tickets ({availableTickets.length})
        </button>
        <button
          onClick={() => setActiveTab("used")}
          className={`pb-3 text-lg font-semibold transition-colors ${
            activeTab === "used"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Used Tickets ({usedTickets.length})
        </button>
      </div>

      {/* Available Tickets */}
      {activeTab === "available" && (
        <div className="space-y-3">
          {availableTickets.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mb-4 text-6xl">🎫</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Available Tickets
              </h3>
              <p className="text-gray-600">
                Win tournaments to earn free meal tickets!
              </p>
            </div>
          ) : (
            availableTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-lg border-2 border-green-200 bg-green-50 p-3"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🎟️</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Winning Ticket
                    </h4>
                    <p className="text-xs text-gray-500">
                      {ticket.tournamentId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onUseTicket(ticket.id)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Use Ticket
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Used Tickets History */}
      {activeTab === "used" && (
        <div className="space-y-3">
          {usedTickets.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📋</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Used Tickets Yet
              </h3>
              <p className="text-gray-600">
                Your ticket usage history will appear here
              </p>
            </div>
          ) : (
            usedTickets.map((ticket) => {
              const restaurant = restaurants.find(
                (r) => r.id === ticket.restaurantId
              );
              return (
                <div
                  key={ticket.id}
                  className="rounded-lg border-2 border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{restaurant?.logo}</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {restaurant?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Used on:{" "}
                          {ticket.usedAt
                            ? new Date(ticket.usedAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {ticket.billAmount} /- 
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsTabs;
