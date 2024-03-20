# variables.tf

variable "instance_count" {
  description = "Número de instancias a crear"
  type        = number
  default     = 4
}

# main.tf

provider "google" {
  # credentials = file("/home/alonsosalasdias15_gmail_com/.gcp/gcp-key-ansible-sa.json") # Crar una service account en gcp
  project     = "caliperbesu-417220" # "<tu ID de proyecto GCP>"
  region      = "us-central1"
}

resource "google_compute_instance" "worker" {
  count        = var.instance_count
  name         = "worker-${count.index}"
  machine_type = "e2-small"
  zone         = "us-central1-a"
  tags = [ "blockchain","http-server","https-server","allow-ssh" ]
  scheduling {
    preemptible                 = true
    automatic_restart           = false
    provisioning_model          = "SPOT"
  }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "main"
    subnetwork = "public"
    network_ip = "10.0.65.${count.index + 2}"
    access_config {
      // Elegir 'Ephemeral' para asignar una dirección IP externa automáticamente
    }
  }
  #   service_account {
  #   email  = "alonso-salas@benchmark-besu.iam.gserviceaccount.com"
  #   scopes = ["cloud-platform"]
  # }
}

# resource "google_compute_firewall" "allow_ssh" {
#   name    = "allow-ssh"
#   network = "default"

  # allow {
  #   protocol = "tcp"
  #   ports    = ["22"]
  # }

#   source_ranges = ["0.0.0.0/0"]
#   target_tags = ["blockchain"]
# }

resource "google_compute_firewall" "allow_besu" {
  name    = "allow-besu"
  network = "main"
  allow {
    protocol = "tcp"
    ports    = ["30303", "8545", "8546","80","8080","9545","9546"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags = [ "blockchain" ]
}

resource "google_compute_firewall" "allow_besu_udp" {
  name    = "allow-besu-udp"
  network = "main"

  allow {
    protocol = "udp"
    ports    = ["30303", "8545", "8546","80","8080","9545","9546"]
  }

  source_ranges = ["0.0.0.0/0"]
}
#   provisioner "local-exec" {
#     command = "./output_ips.sh ${self.network_interface.0.access_config.0.nat_ip}"
#   }
# }

# resource "null_resource" "exportar_ips" {
#   count = length(google_compute_instance.mi_instancia)

#   provisioner "local-exec" {
#     command = "echo ${google_compute_instance.mi_instancia[count.index].network_interface.0.access_config.0.nat_ip} >> public_ips.txt"
#   }

#   provisioner "local-exec" {
#     command = "echo ${google_compute_instance.mi_instancia[count.index].network_interface.0.network_ip} >> private_ips.txt"
#   }
# }