using MongoDB.Driver;
using Perquacky.Api.Hubs;
using Perquacky.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB
builder.Services.AddSingleton<IMongoClient>(_ =>
    new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoClient>().GetDatabase(
        builder.Configuration["MongoDB:Database"] ?? "perquacky"));

// Word validation (Scrabble dictionary loaded at startup)
builder.Services.AddSingleton<WordService>();
builder.Services.AddSingleton<GameService>();

// SignalR
builder.Services.AddSignalR();

// CORS — allow the React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");

// SignalR hub
app.MapHub<PerquackyHub>("/hubs/perquacky");

app.MapGet("/api/ping", () => Results.Ok(new { message = "pong" }))
   .WithName("Ping").WithOpenApi();

app.MapPost("/api/games", async (CreateGameRequest req, GameService games) =>
{
    var (game, playerId) = await games.CreateGameAsync(req.HostName);
    return Results.Ok(new { gameId = game.Id, code = game.Code, playerId });
});

app.MapPost("/api/games/{code}/join", async (string code, JoinGameRequest req, GameService games) =>
{
    try
    {
        var (game, playerId) = await games.JoinGameAsync(code, req.PlayerName);
        return Results.Ok(new { gameId = game.Id, playerId });
    }
    catch (GameException ex) { return Results.BadRequest(new { error = ex.Message }); }
});

app.MapPost("/api/games/{id}/start", async (string id, GameService games) =>
{
    try
    {
        var game = await games.StartGameAsync(id);
        return Results.Ok(new { gameId = game.Id });
    }
    catch (GameException ex) { return Results.BadRequest(new { error = ex.Message }); }
});

app.MapPost("/api/games/{id}/turns/{turnId}/words", async (
    string id, string turnId, SubmitWordRequest req, GameService games) =>
{
    try
    {
        await games.SubmitWordAsync(id, turnId, req.Word);
        return Results.Ok();
    }
    catch (GameException ex) { return Results.BadRequest(new { error = ex.Message }); }
});

app.MapPost("/api/games/{id}/turns/{turnId}/end", async (string id, string turnId, GameService games) =>
{
    try
    {
        await games.EndTurnAsync(id, turnId);
        return Results.Ok();
    }
    catch (GameException ex) { return Results.BadRequest(new { error = ex.Message }); }
});

app.Run();

// Request DTOs
record CreateGameRequest(string HostName);
record JoinGameRequest(string PlayerName);
record SubmitWordRequest(string Word);
