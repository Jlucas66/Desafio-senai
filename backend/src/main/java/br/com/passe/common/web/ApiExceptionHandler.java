package br.com.passe.common.web;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.common.exception.RequisicaoInvalidaException;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);

    private static final String MSG_REQUISICAO_INVALIDA = "Requisição inválida.";
    private static final String MSG_NAO_ENCONTRADO = "Recurso não encontrado.";

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<ErroResponse> tratarRequisicaoInvalida(RequisicaoInvalidaException ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> tratarNaoEncontrado(RecursoNaoEncontradoException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> tratarRegraNegocio(RegraNegocioException ex) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> tratarRestricaoDoBanco(DataIntegrityViolationException ex) {
        LOG.warn("Restrição do banco violada", ex);
        return resposta(HttpStatus.CONFLICT, "A operação conflita com o estado atual dos dados.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarValidacao(MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .sorted()
                .collect(Collectors.joining(" "));
        return resposta(HttpStatus.BAD_REQUEST, mensagem.isBlank() ? MSG_REQUISICAO_INVALIDA : mensagem);
    }

    @ExceptionHandler({
            HttpMessageNotReadableException.class,
            HttpMediaTypeNotSupportedException.class,
            MissingServletRequestParameterException.class,
            ConstraintViolationException.class,
            HandlerMethodValidationException.class
    })
    public ResponseEntity<ErroResponse> tratarEntradaInvalida(Exception ex) {
        return resposta(HttpStatus.BAD_REQUEST, MSG_REQUISICAO_INVALIDA);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResponse> tratarTipoIncorreto(MethodArgumentTypeMismatchException ex) {
        boolean idDaUrl = ex.getParameter().hasParameterAnnotation(PathVariable.class);
        if (idDaUrl) {
            return resposta(HttpStatus.NOT_FOUND, MSG_NAO_ENCONTRADO);
        }
        return resposta(HttpStatus.BAD_REQUEST, "Parâmetro inválido: " + ex.getName() + ".");
    }

    @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
    public ResponseEntity<ErroResponse> tratarCaminhoInexistente(Exception ex) {
        return resposta(HttpStatus.NOT_FOUND, MSG_NAO_ENCONTRADO);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponse> tratarMetodoNaoSuportado(HttpRequestMethodNotSupportedException ex) {
        return resposta(HttpStatus.METHOD_NOT_ALLOWED, "Método não suportado para este caminho.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarErroInesperado(Exception ex) {
        LOG.error("Erro inesperado", ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor.");
    }

    private ResponseEntity<ErroResponse> resposta(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErroResponse(mensagem));
    }
}