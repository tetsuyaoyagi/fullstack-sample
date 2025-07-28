use actix_cors::Cors;
use actix_web::{post, App, HttpResponse, HttpServer, Responder};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
        .wrap(Cors::default().allowed_origin("http://localhost:18080"))
        .service(send_text)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[post("/send/text")]
async fn send_text(text: String) -> impl Responder {
    println!("received message: {}", text);
    HttpResponse::Ok().body("固定メッセージです。")
}