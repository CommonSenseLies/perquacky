using MongoDB.Driver;
using Perquacky.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// MongoDB
builder.Services.AddSingleton<IMongoClient>(_ =>
    new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoClient>().GetDatabase(
        builder.Configuration["MongoDB:Database"] ?? "perquacky"));

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

// Example minimal API endpoint
app.MapGet("/api/ping", () => Results.Ok(new { message = "pong" }))
   .WithName("Ping")
   .WithOpenApi();

app.Run();
