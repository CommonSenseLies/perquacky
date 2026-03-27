using Microsoft.AspNetCore.SignalR;
using Perquacky.Api.Services;

namespace Perquacky.Api.Hubs;

public class PerquackyHub(GameService gameService) : Hub
{
    /// <summary>
    /// Called by the client after connecting to join a game's SignalR group
    /// and receive the current game state.
    /// </summary>
    public async Task JoinGame(string gameId, string playerId)
    {
        await gameService.AddToGroupAsync(Context.ConnectionId, gameId, playerId);
    }
}
